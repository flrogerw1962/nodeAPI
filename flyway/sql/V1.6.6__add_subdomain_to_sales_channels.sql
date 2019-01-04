ALTER TABLE public.sales_channels ADD subdomain varchar(100) ;
ALTER TABLE public.sales_channels ADD CONSTRAINT idx_sales_channels_2 UNIQUE ( subdomain ) ;
