import json
import pandas as pd

REGIONS = json.loads(open("regions.json").read())


class EC2InstanceType:
    def __init__(self) -> None:
        self.EC2_TYPES = json.loads(open("ec2_instance_type.json").read())
        self.PRODUCTS = []
        self.PRICING = []
        for region in REGIONS:
            with open(f"./data/AmazonEC2/{region['code']}.json") as f:
                print(f"Processing {region['code']}")
                tmp_data = json.load(f)
                self.getProductAndPricingData(tmp_data)
        self.transformProductPricingData(self.PRODUCTS, self.PRICING)

    def getProductAndPricingData(self, data):
        for _, value in data["products"].items():
            tmp_product = {**value, **value["attributes"]}
            del tmp_product["attributes"]
            self.PRODUCTS.append(tmp_product)

        for _, value in data["terms"]["OnDemand"].items():
            for _, value2 in value.items():
                for _, value3 in value2["priceDimensions"].items():
                    tmp_value3 = {**value3, **value3["pricePerUnit"]}
                    del tmp_value3["pricePerUnit"]
                    tmp_pricing = {**value2, **tmp_value3}
                    del tmp_pricing["priceDimensions"]
                    self.PRICING.append(tmp_pricing)

    def formatData(self, x):
        return x.to_dict(orient="records")

    def transformProductPricingData(self, product_data, pricing_data):
        products_df = pd.DataFrame(product_data)
        pricing_df = pd.DataFrame(pricing_data)
        types_df = pd.DataFrame(self.EC2_TYPES)

        merged_df = pd.merge(products_df, pricing_df, how="left", on="sku")

        new_df = merged_df.loc[merged_df["operation"].isin(
            ["RunInstances", "RunInstances:0002", "RunInstances:0010"]) & (merged_df["capacitystatus"] == "Used") & (merged_df["tenancy"] == "Shared")]

        res = new_df.groupby(
            [
                "instanceType",
                "tenancy",
                "vcpu",
                "currentGeneration",
                "instanceFamily",
                "memory",
                "productFamily",
                "physicalProcessor",

            ]).apply(lambda x: self.formatData(x), include_groups=True).reset_index(name="pricing")

        merged_res = pd.merge(types_df, res, how="left",
                              left_on="instance_type", right_on="instanceType")

        merged_res.to_json("ec2_types.json", orient="records", indent=4)
        return merged_res.to_dict(orient="records")


class RDSInstanceType:
    def __init__(self) -> None:
        self.PRODUCTS = []
        self.PRICING = []
        for region in REGIONS:
            with open(f"./data/AmazonRDS/{region['code']}.json") as f:
                print(f"Processing {region['code']}")
                tmp_data = json.load(f)
                self.getProductAndPricingData(tmp_data)
        self.transformProductPricingData(self.PRODUCTS, self.PRICING)

    def getProductAndPricingData(self, data):
        for _, value in data["products"].items():
            tmp_product = {**value, **value["attributes"]}
            del tmp_product["attributes"]
            self.PRODUCTS.append(tmp_product)

        for _, value in data["terms"]["OnDemand"].items():
            for _, value2 in value.items():
                for _, value3 in value2["priceDimensions"].items():
                    tmp_value3 = {**value3, **value3["pricePerUnit"]}
                    del tmp_value3["pricePerUnit"]
                    tmp_pricing = {**value2, **tmp_value3}
                    del tmp_pricing["priceDimensions"]
                    self.PRICING.append(tmp_pricing)

    def formatData(self, x):
        return x.to_dict(orient="records")

    def transformProductPricingData(self, product_data, pricing_data):
        products_df = pd.DataFrame(product_data)
        pricing_df = pd.DataFrame(pricing_data)
        merged_df = pd.merge(products_df, pricing_df, how="left", on="sku")

        new_df = merged_df.loc[
            merged_df["databaseEngine"].isin(
                ["PostgreSQL", "MariaDB", "MySQL"]) &
            (merged_df["deploymentOption"].isin(
                ["Single-AZ", "Multi-AZ"])) & (merged_df["productFamily"].str.contains("Database Storage") == False)]

        res = new_df.groupby(
            [
                "instanceType",
                "vcpu",
                "currentGeneration",
                "instanceFamily",
                "memory",
                "physicalProcessor",
                "processorArchitecture"
            ]).apply(lambda x: self.formatData(x), include_groups=True).reset_index(name="pricing")

        # merged_res = pd.merge(types_df, res, how="left",
        #                       left_on="instance_type", right_on="instanceType")

        res.to_json("rds_types.json", orient="records", indent=4)
        return res.to_dict(orient="records")


if __name__ == "__main__":
    # EC2InstanceType()
    RDSInstanceType()
