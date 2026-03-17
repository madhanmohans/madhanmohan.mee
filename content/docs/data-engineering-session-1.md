### kd = key decisions

1. ad users → graph api
    1. how to connect to data source
2. connecting to diff file formats (csv, excel, txt)
    1. first step to have a common ingestion framework(cif) → to whatever platform you are using (databricks in this case)
    2. identify patterns and leverage it into a framework
    3. can provide custom validation json to make
    4. cover as many pain points as possible
    5. sell this as a product internally
    6. save a lot of value
3. Data validation strategy
    1. we won’t have enough data to test
    2. to test mill, 2 mill records
    3. how to maintain data quality to new system
    4. whenever data bricks object are deployed in prod, we compare gold layer objects with prev systems and we map each row
    5. Row count, row-to-row, last 3 months comp
    6. will need compute but will be beneficial
    7. when data pipelines built → sit runs → generates report
commercial ops   
microsoft azure → databricks → adf, adb  
ingestion  
document best practices  

- bronze, silver, and gold layers
- raw, curated, and consumption layers
migration: hive → databricks