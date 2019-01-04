ALTER TABLE public.sales_channels ALTER COLUMN allow_ship SET NOT NULL;
ALTER TABLE public.sales_channels ALTER COLUMN allow_pickup SET DEFAULT false;
ALTER TABLE public.sales_channels ALTER COLUMN allow_pickup SET NOT NULL;
ALTER TABLE public.sales_channels ADD store bool DEFAULT false NOT NULL;
ALTER TABLE public.sales_channels ADD web bool DEFAULT true NOT NULL
