import json
import os
from utils import GetData, SaveData
from Logger import GetLogger

BASE_URL = "https://pricing.us-east-1.amazonaws.com"

SERVICE_LIST = ["AmazonEC2", "AmazonRDS",
                "AmazonRedshift", "AmazonElastiCache", "AmazonES"]

log = GetLogger("Extractor")


def checkForUpdates():
    try:
        with open("./data/metadata.json") as f:
            metadata = json.load(f)

        if (metadata["last_updated"] == "never"):
            return True
        else:
            index_path = "/offers/v1.0/aws/index.json"
            index_data = GetData(BASE_URL + index_path)
            SaveData(index_data, "./data/index.json")
            index_data = json.loads(index_data)
            if (metadata["last_updated"] == index_data["publicationDate"]):
                return False
            else:
                return True
    except Exception as error:
        log.error("Error while checking for updates")
        log.error(error)
        return True


def downloadAllPricingData():

    with open("./data/index.json") as f:
        index_data = json.load(f)

    tmp_service_mapping = {}

    for service, service_details in index_data["offers"].items():
        if service in SERVICE_LIST:
            tmp_service_mapping[service] = service_details
            os.makedirs(f"./data/{service}", exist_ok=True)

    for service, service_details in tmp_service_mapping.items():
        log.info(f"Downloading data for {service}")
        region_data = GetData(
            BASE_URL + service_details["currentRegionIndexUrl"])
        SaveData(region_data, f"./data/{service}.json")
        region_data = json.loads(region_data)
        for region_name, region_urls in region_data["regions"].items():
            log.info(f"Downloading data for {service} in {region_name}")
            data = GetData(
                BASE_URL + region_urls["currentVersionUrl"])
            SaveData(data, f"./data/{service}/{region_name}.json")
    with open("./data/metadata.json", "w") as f:
        metadata = {"last_updated": index_data["publicationDate"]}
        json.dump(metadata, f)
        log.info("Updated Metadata")


if __name__ == "__main__":
    log.info("Checking for updates")
    if checkForUpdates():
        log.info("Updates found, downloading data")
        downloadAllPricingData()
        log.info("Data downloaded successfully")
    else:
        log.info("No updates found, skipping download")
