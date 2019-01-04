CREATE TABLE public.price_lists (
	id                   serial  NOT NULL,
  name                 varchar(100)  NOT NULL,
  description          varchar(255)  NOT NULL,
	CONSTRAINT pk_price_lists PRIMARY KEY ( id )
 );

CREATE TABLE public.price_list_items (
	price_list_id        integer  NOT NULL,
	item_id              integer  NOT NULL,
	price                integer DEFAULT 0 ,
	CONSTRAINT idx_price_list_items PRIMARY KEY ( price_list_id, item_id )
);

ALTER TABLE public.price_list_items ADD CONSTRAINT fk_price_list_items FOREIGN KEY ( price_list_id ) REFERENCES public.price_lists( id ) ON DELETE CASCADE;
ALTER TABLE public.price_list_items ADD CONSTRAINT fk_price_list_items_items FOREIGN KEY ( item_id ) REFERENCES public.items( id );

ALTER TABLE public.sales_channels ADD price_list_id integer;

CREATE INDEX idx_sales_channels_1 ON public.sales_channels ( price_list_id );

ALTER TABLE public.sales_channels ADD CONSTRAINT fk_sales_channels_price_lists FOREIGN KEY ( price_list_id ) REFERENCES public.price_lists( id );
