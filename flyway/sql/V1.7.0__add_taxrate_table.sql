CREATE TABLE sales_tax
(
  zipcode 		varchar(64) NOT NULL,
  name 				varchar(64),
  tax 				real,
  disabled    bool DEFAULT false,
  CONSTRAINT sales_tax_pkey PRIMARY KEY (zipcode)
);
