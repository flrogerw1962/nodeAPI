ALTER TABLE public.order_items ALTER COLUMN price SET NOT NULL;
ALTER TABLE public.order_items ALTER COLUMN price TYPE integer;
ALTER TABLE public.price_list_items ALTER COLUMN price SET NOT NULL;
ALTER TABLE public.items ALTER COLUMN default_price SET NOT NULL;
ALTER TABLE public.items ALTER COLUMN default_price TYPE integer;
