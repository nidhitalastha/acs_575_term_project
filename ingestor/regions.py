import boto3
import json


def get_regions():
    ec2 = boto3.client('ec2')

    # Retrieves all regions/endpoints that work with EC2
    response = ec2.describe_regions(AllRegions=True)
    ssm_client = boto3.client('ssm')
    regions = []
    for resp in response['Regions']:
        region_id = resp['RegionName']
        tmp = '/aws/service/global-infrastructure/regions/%s/longName' % region_id
        ssm_response = ssm_client.get_parameter(Name=tmp)
        region_name = ssm_response['Parameter']['Value']
        regions.append(
            {
                'code': region_id,
                'name': region_name
            }
        )

    with open('regions.json', 'w') as f:
        json.dump(regions, f, indent=4)

    response = ec2.describe_availability_zones(AllAvailabilityZones=True)
    azs = []
    for resp in response['AvailabilityZones']:
        azs.append(
            {
                "region_code": resp["RegionName"],
                "name": resp["ZoneName"],
                "code": resp["ZoneId"],
            }
        )

    with open('availability_zones.json', 'w') as f:
        json.dump(azs, f, indent=4)


if __name__ == '__main__':
    get_regions()
