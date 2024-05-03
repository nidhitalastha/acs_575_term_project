#! /usr/bin/env bash

# echo "Downloading the latest version of the pricing data..."

# # Download the latest version of the pricing data
# python3 extractor.py


echo "Processing the pricing data..."

# Process the pricing data
python3 transform.py


echo "Uploading the processed data to the database..."

# Upload the processed data to the database
python3 load.py
