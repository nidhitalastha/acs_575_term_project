from time import sleep
import json
from sqlalchemy import Column, Integer, String, Double, ForeignKey, create_engine, JSON, UniqueConstraint, UUID
from sqlalchemy.orm import relationship, backref, sessionmaker, joinedload, declarative_base
from tqdm import tqdm
import uuid

engine = create_engine(
    'postgresql://postgres:ktv3mdb4gmh!WCW_xcu@db-term-project.ch8ue46q6ohs.us-east-2.rds.amazonaws.com:5432/aws_cc?connect_timeout=10')

Base = declarative_base()


class Region(Base):
    __tablename__ = 'regions'
    code = Column(String, primary_key=True)
    name = Column(String)


class EC2InstanceType(Base):
    __tablename__ = 'ec2_instance_types'
    instance_type = Column(String, primary_key=True)
    generation = Column(String)
    family = Column(String)
    vcpu = Column(Integer)
    cpu_info = Column(JSON)
    memory = Column(Integer)
    memory_per_vcpu = Column(Integer)
    networking = Column(JSON)
    storage = Column(JSON)


class EC2Pricing(Base):
    __tablename__ = 'ec2_pricing'
    id = Column(UUID, primary_key=True)
    instance_type = Column(String, ForeignKey(
        'ec2_instance_types.instance_type'))
    operation = Column(String)
    region = Column(String, ForeignKey('regions.code'))
    operating_system = Column(String)
    description = Column(String)
    unit = Column(String)
    price = Column(Double)
    __table_args__ = (UniqueConstraint(
        'instance_type', 'operation', 'region', name='_ec2_instance_op_region_uc'),)


class RDSInstanceType(Base):
    __tablename__ = 'rds_instance_types'
    instance_type = Column(String, primary_key=True)
    generation = Column(String)
    family = Column(String)
    vcpu = Column(Integer)
    memory = Column(String)
    physical_processor = Column(String)
    processor_architecture = Column(String)


class RDSPricing(Base):
    __tablename__ = 'rds_pricing'
    id = Column(UUID, primary_key=True)
    instance_type = Column(String, ForeignKey(
        'rds_instance_types.instance_type'))
    operation = Column(String)
    deployment_option = Column(String)
    region = Column(String, ForeignKey('regions.code'))
    engine_code = Column(String)
    database_engine = Column(String)
    description = Column(String)
    unit = Column(String)
    price = Column(Double)
    __table_args__ = (UniqueConstraint(
        'instance_type', 'operation', 'region', "deployment_option", 'engine_code', name='_rds_instance_op_region_uc'),)


Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()


def ingest_region(regions_data):
    for item in regions_data:
        region = Region(code=item["code"], name=item["name"])
        session.add(region)
    session.commit()


def ingest_ec2_types(ec2_types_data):
    for item in tqdm(ec2_types_data, desc="Ingesting EC2 Instance Types"):
        sleep(0.001)
        if item.get('pricing') is None:
            continue
        try:
            instance = EC2InstanceType(
                instance_type=item["instance_type"],
                generation="Current" if item["current_generation"] else "Previous",
                family=item["instanceFamily"],
                vcpu=item["v_cpu_info"]["DefaultVCpus"],
                cpu_info={
                    "clock_speed_ghz": str(item["processor_info"]["SustainedClockSpeedInGhz"]) + " GHz",
                    "arch": ", ".join(item["processor_info"]["SupportedArchitectures"]),
                    "physical_processor": item["physicalProcessor"]
                },
                memory=item["memory_info"]["SizeInMiB"],
                memory_per_vcpu=item["memory_info"]["SizeInMiB"] /
                item["v_cpu_info"]["DefaultVCpus"],
                networking=item["network_info"],
                storage=item["ebs_info"]
            )
            session.add(instance)
        except Exception as e:
            print(e)
            print("Error with instance type: ", item)
    session.commit()


def ingest_ec2_pricing(pricing_data):
    tmp_data = []
    for instance_details in pricing_data:
        pricing_list = instance_details["pricing"]
        try:
            if pricing_list is None:
                continue
            for pricing in pricing_list:
                pricing_obj = EC2Pricing(
                    id=str(uuid.uuid4()),
                    instance_type=instance_details["instance_type"],
                    operation=pricing["operation"],
                    operating_system=pricing["operatingSystem"],
                    region=pricing["regionCode"],
                    description=pricing["description"],
                    unit=pricing["unit"],
                    price=pricing["USD"]
                )
                tmp_data.append(pricing_obj)
        except Exception as e:
            print(e)
            print("Error with pricing: ", instance_details)

    for pricing_obj in tqdm(tmp_data, desc="Ingesting EC2 Instance Pricing"):
        sleep(0.0001)
        session.add(pricing_obj)
    session.commit()


def load_ec2_data(data):
    session.query(EC2Pricing).delete()
    session.query(EC2InstanceType).delete()
    ingest_ec2_types(data)
    ingest_ec2_pricing(data)


def ingest_rds_types(ec2_types_data):
    for item in tqdm(ec2_types_data, desc="Ingesting RDS Instance Types"):
        sleep(0.001)
        if item.get('pricing') is None:
            continue
        try:
            instance = RDSInstanceType(
                instance_type=item["instanceType"],
                generation="Current" if item["currentGeneration"] else "Previous",
                family=item["instanceFamily"],
                vcpu=int(item["vcpu"]),
                memory=item["memory"],
                physical_processor=item["physicalProcessor"],
                processor_architecture=item["processorArchitecture"]
            )
            session.add(instance)
        except Exception as e:
            print(e)
            print("Error with instance type: ", item)
    session.commit()


def ingest_rds_pricing(pricing_data):
    tmp_data = []
    for instance_details in pricing_data:
        pricing_list = instance_details["pricing"]
        try:
            if pricing_list is None:
                continue
            for pricing in pricing_list:
                pricing_obj = RDSPricing(
                    id=str(uuid.uuid4()),
                    instance_type=instance_details["instanceType"],
                    operation=pricing["operation"],
                    region=pricing["regionCode"],
                    deployment_option=pricing["deploymentOption"],
                    engine_code=pricing["engineCode"],
                    database_engine=pricing["databaseEngine"],
                    description=pricing["description"],
                    unit=pricing["unit"],
                    price=pricing["USD"],
                )
                tmp_data.append(pricing_obj)
        except Exception as e:
            print(e)
            print("Error with pricing: ", instance_details)

    for pricing_obj in tqdm(tmp_data, desc="Ingesting RDS Instance Pricing"):
        sleep(0.0001)
        try:
            session.add(pricing_obj)
        except Exception as e:
            print(e)
            print("Error with pricing: ", pricing_obj)
    session.commit()


def load_rds_data(data):
    session.query(RDSPricing).delete()
    session.query(RDSInstanceType).delete()
    ingest_rds_types(data)
    ingest_rds_pricing(data)


with open("./ec2_types.json") as f:
    ec2_data = json.load(f)

    load_ec2_data(ec2_data)


with open("./rds_types.json") as f:
    rds_data = json.load(f)

    load_rds_data(rds_data)
