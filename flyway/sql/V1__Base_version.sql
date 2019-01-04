CREATE TABLE catalogs (
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	description          varchar  ,
	CONSTRAINT pk_catalogs PRIMARY KEY ( id )
 );

CREATE TABLE products (
	id                   serial  NOT NULL,
	name                 varchar(64)  ,
	is_disabled          bool  ,
	image_url            varchar(256)  ,
	description          text  ,
	categories           _int4  ,
	"isTaxable"          bool DEFAULT true ,
	CONSTRAINT idx_products PRIMARY KEY ( id )
 );

CREATE TABLE sales_channels (
	id                   serial  NOT NULL,
	name                 varchar(64)  ,
	display_name         varchar(64)  ,
	"type"               varchar(64)  ,
	is_default           bool  ,
	allow_pickup         bool  ,
	allow_ship           bool  ,
	allowed_stock_locations _int4  ,
	price_list_id        integer  ,
	catalog_id           integer  ,
	CONSTRAINT fk_sales_channels_catalogs FOREIGN KEY ( catalog_id ) REFERENCES catalogs( id )
 );

CREATE INDEX idx_sales_channels ON sales_channels ( id );

CREATE INDEX idx_sales_channels_0 ON sales_channels ( catalog_id );

CREATE TABLE stock_locations (
	id                   serial  NOT NULL,
	name                 varchar(64)  ,
	display_name         varchar(64)  ,
	"type"               varchar(64)  ,
	allow_pickup         bool  ,
	allow_ship           bool  ,
	is_preferred         bool  ,
	group_id             integer  ,
	store_info           json  ,
	CONSTRAINT idx_stock_locations PRIMARY KEY ( id )
 );

CREATE TABLE users (
	id                   serial  NOT NULL,
	email                varchar(256)  NOT NULL,
	crypted_password     varchar(256)  ,
	stripe_id            varchar(256)  ,
	name                 varchar(64)  ,
	signup_date          timestamp DEFAULT now() ,
	CONSTRAINT idx_users UNIQUE ( id ) ,
	CONSTRAINT idx_email UNIQUE ( email )
 );

CREATE TABLE addresses (
	id                   serial  NOT NULL,
	address_1            varchar(256)  ,
	address_2            varchar(256)  ,
	city                 varchar(128)  ,
	"state"              varchar(4)  ,
	zip_code             varchar(20)  ,
	phone_number         varchar(24)  ,
	user_id              integer  NOT NULL,
	CONSTRAINT fk_addresses_users FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE INDEX idx_addresses ON addresses ( user_id );

CREATE TABLE carts (
	id                   serial  NOT NULL,
	user_id              bigint  ,
	create_date          timestamp DEFAULT now() ,
	discounts            _varchar DEFAULT '{XXX098,FREESHIP}'::character varying[] ,
	order_discount       float8 DEFAULT 0.00 NOT NULL,
	ship_discount        float8 DEFAULT 0 NOT NULL,
	CONSTRAINT idx_cart PRIMARY KEY ( id ),
	CONSTRAINT fk_carts_users FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE INDEX idx_carts ON carts ( user_id );

CREATE TABLE inventory_items (
	id                   serial  NOT NULL,
	stock_location_id    integer  ,
	on_hand_quantity     integer  ,
	backordered_quantity integer  ,
	is_backorderable     bool DEFAULT false ,
	CONSTRAINT idx_inventory_items PRIMARY KEY ( id ),
	CONSTRAINT fk_inventory_items FOREIGN KEY ( stock_location_id ) REFERENCES stock_locations( id )
 );

CREATE INDEX idx_inventory_items_0 ON inventory_items ( stock_location_id );

CREATE TABLE items (
	id                   serial  NOT NULL,
	product_id           integer  ,
	name                 varchar(64)  ,
	"options"            json  ,
	photo_real_template_url varchar(264)  ,
	default_price        real  ,
	is_disabled          bool  ,
	sku                  varchar(64)  ,
	CONSTRAINT idx_item PRIMARY KEY ( id ),
	CONSTRAINT fk_items_products FOREIGN KEY ( product_id ) REFERENCES products( id )
 );

CREATE INDEX idx_items ON items ( product_id );

CREATE TABLE orders (
	id                   serial  NOT NULL,
	user_id              bigint  ,
	"options"            json  ,
	payment_info         json  ,
	total_price          real  ,
	status               varchar(64)  ,
	gift_message         char(256)  ,
	create_date          timestamp DEFAULT now() ,
	CONSTRAINT idx_order PRIMARY KEY ( id ),
	CONSTRAINT fk_orders_users FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE INDEX idx_orders ON orders ( user_id );

CREATE TABLE photos (
	id                   serial  NOT NULL,
	user_id              bigint  ,
	photo_url            varchar(256)  ,
	is_deleted           bool DEFAULT false ,
	cart_id              bigint  ,
	CONSTRAINT idx_photos PRIMARY KEY ( id ),
	CONSTRAINT fk_photos_users FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE INDEX idx_photos_0 ON photos ( user_id );

CREATE TABLE projects (
	id                   serial  NOT NULL,
	item_id              integer  ,
	photo_customization  json  ,
	"options"            json  ,
	name                 varchar(128)  ,
	product_id           integer  ,
	product_name         varchar(128)  ,
	user_id              integer  ,
	CONSTRAINT pk_projects PRIMARY KEY ( id ),
	CONSTRAINT fk_projects_users FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE INDEX idx_projects ON projects ( user_id );

CREATE TABLE stock_location_items (
	id                   serial  NOT NULL,
	stock_location_id    integer  NOT NULL,
	item_id              integer  NOT NULL,
	manage_inventory     bool DEFAULT false NOT NULL,
	is_disabled          bool DEFAULT false ,
	CONSTRAINT idx_stock_location_items PRIMARY KEY ( id ),
	CONSTRAINT fk_stock_location_items FOREIGN KEY ( stock_location_id ) REFERENCES stock_locations( id )
 );

CREATE INDEX idx_stock_location_items_0 ON stock_location_items ( stock_location_id );

CREATE TABLE cart_items (
	id                   serial  NOT NULL,
	quantity             integer  ,
	item_id              integer  ,
	cart_id              bigint  ,
	price                real  ,
	"options"            json DEFAULT '{}'::json ,
	stock_location_id    integer  ,
	photo_customization  json DEFAULT '{}'::json ,
	status               varchar(64)  ,
	fulfillment_type     char(64)  ,
	order_id             integer  ,
	is_past_item         bool DEFAULT false NOT NULL,
	CONSTRAINT idx_cart_items PRIMARY KEY ( id ),
	CONSTRAINT fk_cart_items_carts FOREIGN KEY ( cart_id ) REFERENCES carts( id )    ,
	CONSTRAINT fk_cart_items_items FOREIGN KEY ( item_id ) REFERENCES items( id )
 );

CREATE INDEX idx_cart_items_0 ON cart_items ( cart_id );

CREATE INDEX idx_cart_items_1 ON cart_items ( item_id );

CREATE TABLE catalog_items (
	catalog_id           integer  NOT NULL,
	item_id              integer  NOT NULL,
	CONSTRAINT idx_catalog_items PRIMARY KEY ( catalog_id, item_id ),
	CONSTRAINT fk_catalog_items_items FOREIGN KEY ( item_id ) REFERENCES items( id )    ,
	CONSTRAINT fk_catalog_items_catalogs FOREIGN KEY ( catalog_id ) REFERENCES catalogs( id )
 );

CREATE INDEX idx_catalog_items_1 ON catalog_items ( item_id );

CREATE INDEX idx_catalog_items_2 ON catalog_items ( catalog_id );

CREATE TABLE order_items (
	id                   serial  NOT NULL,
	quantity             integer  ,
	item_id              integer  ,
	price                real  ,
	"options"            json DEFAULT '{}'::json ,
	stock_location_id    integer  ,
	photo_customization  json DEFAULT '{}'::json ,
	status               varchar(64)  ,
	fulfillment_type     char(64)  ,
	order_id             integer  ,
	CONSTRAINT idx_order_items PRIMARY KEY ( id ),
	CONSTRAINT fk_order_items_orders FOREIGN KEY ( order_id ) REFERENCES orders( id )    ,
	CONSTRAINT fk_order_items_items FOREIGN KEY ( item_id ) REFERENCES items( id )
 );

CREATE INDEX idx_order_items_0 ON order_items ( order_id );

CREATE INDEX idx_order_items_1 ON order_items ( item_id );

CREATE TABLE categories (
	id                   serial  NOT NULL,
	name                 varchar(64)  ,
	is_home_page         bool DEFAULT false ,
	parent_category_id   integer  ,
	is_parent            bool DEFAULT false ,
	CONSTRAINT idx_categories PRIMARY KEY ( id )
 );

CREATE INDEX idx_categories_0 ON categories ( parent_category_id );

CREATE TABLE products_categories (
	category_id          integer  NOT NULL,
	product_id           integer  NOT NULL,
	CONSTRAINT idx_products_categories PRIMARY KEY ( category_id, product_id )
 );

CREATE INDEX idx_products_categories_0 ON products_categories ( product_id );

CREATE INDEX idx_products_categories_1 ON products_categories ( category_id );

ALTER TABLE categories ADD CONSTRAINT fk_categories_categories FOREIGN KEY ( parent_category_id ) REFERENCES categories( id );

COMMENT ON CONSTRAINT fk_categories_categories ON categories IS '';

ALTER TABLE products_categories ADD CONSTRAINT fk_products_categories_products FOREIGN KEY ( product_id ) REFERENCES products( id );

COMMENT ON CONSTRAINT fk_products_categories_products ON products_categories IS '';

ALTER TABLE products_categories ADD CONSTRAINT fk_products_categories FOREIGN KEY ( category_id ) REFERENCES categories( id );

COMMENT ON CONSTRAINT fk_products_categories ON products_categories IS '';
