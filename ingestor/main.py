import json
import os
from utils import DownloadandGetFile

BASE_URL = "https://pricing.us-east-1.amazonaws.com"
index_path = "/offers/v1.0/aws/index.json"


service_data = DownloadandGetFile(BASE_URL + index_path, "./data/index.json")

service_data = json.loads(service_data)

service_list = ["AmazonEC2", "AmazonRDS",
                "AmazonRedshift", "AmazonElastiCache", "AmazonES"]

filtered_urls = {}

for service, service_urls in service_data["offers"].items():
    if service in service_list:
        filtered_urls[service] = service_urls
        os.makedirs(f"./data/{service}", exist_ok=True)

for service, service_urls in filtered_urls.items():
    region_data = DownloadandGetFile(
        BASE_URL + service_urls["currentRegionIndexUrl"], f"./data/{service}.json")
    region_data = json.loads(region_data)
    for region_name, region_urls in region_data["regions"].items():
        data = DownloadandGetFile(
            BASE_URL + region_urls["currentVersionUrl"], f"./data/{service}/{region_name}.json")
        print(f"Downloaded {service}_{region_name}.json")
