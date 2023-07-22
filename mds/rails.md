### 1 Migrations & Models

#### 1.1 create amigration

```bash
#migration to add or modify existing column!
rails generate migration AddScoreToTeam    # genertae just a migration
```

```ruby
 def change

 end
```

or up down , .. the down moethd should do the oppositve of up so we can call
`rails db:rollback `

apply the new changes in the db:
Rails db:migrate

#### 1.2 create a new model

```ruby
class CreateTermsAndConditions < ActiveRecord::Migration[7.0]
  def change
    create_table :terms_and_conditions do |t|
      # add the columns here
    end
  end
end
```

after that we can create the model for that table

```bash
rails generate model Like                  # will create the mnodel and the migration
rails generate controller admin/v1/likes   # create a ontroller with namespaces
```

class

and now we canuse it like
User.all

#### 1.3 adding simple column

while creating a table

```ruby
  def change
    create_table :terms_and_conditions do |t|
      t.string :hash_id
    end
  end
```

add it on an exiting table

```ruby
  def change
    add_column :table_name, :column_name, :string
  end
```

the datatype can be either `string`, `number`, `text`

In Rails, when you create a column in a database table using a migration, the column is nullable by default to make it unnallable add the `null: false` flag

#### 1.4 Updating columns

```ruby
  def change
    change_column :table_name, :column_name, :new_data_type
  end
```

#### 1.5 Droping column

can be done on the down method too

#### 1.6 renaming column

```ruby
  def change
    rename_column :table_name, :old_column_name, :new_column_name
  end
```

#### 1.7 refrences columns

while creating a table

```ruby
  def change
    create_table :terms_and_conditions do |t|
      t.refrences :bank_users, foreign_key: {on_delete: :nullify}
    end
  end
```

on an existing table

`add_reference`: automatically creates a new colum with the conventionally expected name (parent_table_id), its the same as `t.references`

and then we combine it with `foreign_key` flag to make it a foreign key constraint

```ruby
def change
   add_reference :viewing_reports, :office, null: true, foreign_key: {on_delete: :nullify}
 end
```

`add_foreign_key`: is also used to create a foreign key constraint,but it specifically creates a foreign key on an existing column, rather than creating a new column.

This method is useful when you want to create a foreign key relationship between two existing columns that might not follow the Rails convention for foreign keys (e.g., columns ending with \_id).

```ruby
 def change
    add_foreign_key :bank_users, :brokers, null: true, column: :parent_id, on_delete: :cascade
 end
```

one the Databese level, The on_delete option accept three values:

- `:nullify` This sets the foreign key in dependent records to NULL when the referenced record is deleted.

- `:restrict` (default when we use foreign_key: trrue ) This prevents the deletion of the referenced record if there are any dependent records.

- `:cascade` This automatically deletes all dependent records when the referenced record is deleted.

by default forign keys are not **nullable** on SQL databases

#### 1.8 adding indexes and uniquness

primiry and forikn are index unique by default

to create an index while creating the tables

```ruby
  def change
    create_table :your_table do |t|
      # Your other columns...

      # This line creates an index column and adds a unique constraint to it.
      t.index :your_index_column
    end
  end
```

create an index on an exiting table

```ruby
# unique email for each user
add_index :users, :email
```

add uniquness to the index

```ruby
# unique email for each user
add_index :users, :email, unique: true

# on the framework level add this to the User model:
validates :draft, uniqueness: true

```

uniquness with isolation

```ruby
# the table will have only two record one with draft false one with draft true
add_index :terms_and_conditions, :draft, unique: true

# unique names only for super users
add_index :user, :name, unique: true, where: "super_user = true"

# only one record can have draft = trye
add_index :terms_and_conditions, :draft, unique: true, where: 'draft = true'


# on the framework level add:
validates :draft, uniqueness: {if: -> { draft? }}
```

its not nessessary to hav this vqalidator on framwwork level! because if two node of the app are running this check one can fail and one can pass!
always validate data om db level

Its very important to add the contarint on the database level

When using the "validate uniqueness" feature in Ruby on Rails at the framework level only, without considering multiple running processes, it can cause data inconsistency. For example, if two processes simultaneously create records with the same unique constraint (e.g., email address), both processes may pass the uniqueness check and create duplicate data. To prevent this, it's important to enforce uniqueness constraints at the database level, ensuring consistency even with multiple processes or servers

#### 1.9 default values

- in ppostgres adding the contrint default to a column later wont change the previous null values!
  it has to be done manullly on the same migration using sql raw!

class AddDefaultToGrafs < ActiveRecord::Migration[7.0]
def change
execute <<~SQL
UPDATE bank_users SET grafs = '[]' WHERE grafs IS NULL
SQL

    change_column :bank_users, :grafs, :jsonb, null: false, default: []

end
end

Exucute the seed first because sitting null: false when there is always previous null values will throw an error!

but you cant use BankUser.update_all
because BankUser might not exist in the future, so use use raw

When you add a uniqueness constraint to a column in a database, the database must check if any new or updated value violates the uniqueness requirement. Without an index, the database would need to perform a full table scan every time it wants to verify uniqueness, which can be extremely slow and inefficient, especially as the size of the table grows.

However, with an index, the database creates a sorted data structure (usually a B-tree) based on the values in the indexed column. This data structure allows the database to quickly look up values and check for duplicates. When you add a unique index to a column, the database ensures that no two rows in the table have the same value in that column. If an attempt is made to insert or update a row with a duplicate value, the database will throw an error, preventing the operation from succeeding.

In summary, a unique index helps the database maintain uniqueness efficiently by providing a fast way to look up values in the indexed column. It improves query performance and ensures data integrity, which is crucial when enforcing uniqueness constraints on specific columns.

#### 1.10 timeSTAMPS

#### 1.11 Json Column

### 2 Association

#### 2.1 OneToMany

```ruby
class Palyer < ApplicationRecord
belongs_to :team
```

```ruby
class Team < ApplicationRecord
has_many :players
```

#### 2.2 ManyToOne

```ruby
# Many-to-One is just the inverse of One-to-Many
```

#### 2.3 OneToOne

note: all we need to to is to ad unique: true on the refrence column foring key on the **databse leve**, and on the framework level add:

```ruby
class Team < ApplicationRecord
belongs_to :owner
```

```ruby
class User < ApplicationRecord
has_one :Team
```

#### 2.4 Through

for example if a user has many post and a post likers we can user

user has many likes through posts , which will create a join query on the 3 tables

```ruby
Class broker
has_many :viewings, through: :bid_items
has_many :viewers, through: :viewings
```

for exmaple we can now do,
broker.viewers.where({ viewings: { created_at: now.. } })

#### 2.5 ManyToMany

this one require creating a separe join table, for exxamples users and rooms, a user can join many rooms and a room can have many user, so we boith use

user.rooms
and
room.users

and both models

```ruby
  def change
    create_join_table :brokers, :service_partners
  end

# by default, this will create two columns broker_id and service_partner_id,both are automatically created as an index and unique in the join table.

# to add extra colunb in the join table use this syntax
 create_join_table :brokers, :service_partners do |t|
      # t.index [:broker_id, :service_partner_id]  # This line is automatically added
      # t.index [:service_partner_id, :broker_id]  # This line is automatically added
    end
```

now on the framework le´vel models we cab add

```ruby
Class User
belongs_to_and_has_many: rooms

Class Room
belongs_to_and_has_many: users
```

#### 2.6 change asociaton table name

by by calling broker. service_partners u will get the result from the joins table!
what if a service is create by a broker so it has its foreign key, and we want to know servidees created by a specific broker/ for example a user own rooms and can join rooms, they when should rename he join table something else

```ruby
for that
Broker
  has_many :service_partners, dependent: :destroy
  has_and_belongs_to_many :selected_service_partners,
                          class_name: 'ServicePartner',
                          join_table: :brokers_service_partners

ServicePartner
  belongs_to :broker
  has_and_belongs_to_many :brokers
```

or when we create a model that its alreadt plural

has_many :terms_and_conditions, class_name: 'TermsAndConditions' # class_name> because the class its already plural
but not for belongs to

#### 2.7 change asociaton fk name

by defualt belongs_to :parent_table , asumes that the forign key is tabled_id but if our refrensh forign key have a diffrence name (probably use add foreign key instead of add refrence (2.1)) we need to specify to the orm what forkey_key it should use

```ruby
class Player < ApplicationRecord
  belongs_to :team, foreign_key: :t_id
end
```

```ruby
class Team < ApplicationRecord
  has_many :players, foreign_key: :t_id
end
```

#### 2.8 polymorfism

**polymorphic** refers to the ability of an association to belong to more than one type of model.

for example an advidtsiment can belong to a bank or broker

on the child table on the db level add:

```ruby
t.references :partner, polymorphic: true
```

```ruby
Class Ads
  belongs_to :partner, polymorphic: true

Class Bank
  has_many :advertisements, as: :partner

Class Broker
  has_many :advertisements, as: :partner
```

#### 2.9 dependent options

on Rails Framework accepts level, The dependent option in Rails accepts four values:

- `:destroy/:destroy_all` The associated objects are destroyed alongside this object by calling their destroy method one by one, so it will trigger any hooks like before_delete for every deleted associated object

- `:delete/:delete_all` All associated objects are destroyed immediately in one query without calling their :destroy method

- `:nullify` All associated objects' foreign keys are set to NULL without calling their save callbacks

#### 2.10 Optional assosiation

by default the forign key can not be null, by we can change it behavioour by specifying options flag.

by **note** we need tomake sure the on the db level we set the forgien key to nullable usibng `null: true`

```ruby
class ChildTable < ApplicationRecord
  belongs_to :parent_table, optional: :true
end
```

#### 2.11 framework VS DB level ( flag imortant part)

You may think that why specify unqiue trye on korign key if we already set has one on the framework or .. if you've already specified on_delete: :cascade on the database-level then there is no need to adding dependent: :destroy in the model , but first: it deletes the records from the memory to ensures that the memory representation of your db in your Rails application remains consistent!
Second: its good to include dependent on the model even if its specific of migration / db:level! Because sometimes we may wanna run a hook if a record is deleted!
like: before_destroy :home_journey_schedule_cleanup
And the framework wont notice when a record is deleted from the db unless we specify depends destroy

any way its just good to also add it to ensure a considtence app! incase two intances of the app are writting on the same tine,

anyways we should just just relay on ActiveRecord to handle the deletion
of related records, which is not always the desired behavior.

### 3 enums

put under orm

#### 3.1 overview

```ruby
  #enums represent a Model attreubite, status is a column in the cars model
  Class Car
  enum status: [:available, :rented, :out_of_order]

  # there are all the same
  Car.where({status: :available})
  Car.where({status: 0})
  Car.available

  Car.not_available # will return anything that is not available!
```

#### 3.2 backwardscompatibility

backwardscompatibility, to specify different values

```ruby

 enum service_type: {custom: -1, bredbandsval: 0, lansfast: 1, gofido: 2, tibber: 3}
```

#### 3.3 validations

```ruby
  validates_inclusion_of :service_type,
                         in:      service_types.keys + service_types.values,
                         message: "'%{value}' is invalid"


```

in Ruby on Rails, validates_inclusion_of is a validation helper method used to validate that an attribute's value is included in a given set of values. It ensures that the attribute value is present in a given array, range, or enumerable.

```ruby
class Person < ApplicationRecord
 validates_inclusion_of :gender, in: ['male', 'female']
end

```

### 4 Scopes (move to orm part)

scopes are class methods

```ruby
Class Car < ApplicationRecord
  scope :with_rentals_count,
      -> {
        Joins_add(:rentals) //how to join attachments? Add in orm! See viewing report scope on app//////////////////////////?????????????????????????????
          .select_add('COUNT(rentals.id) AS rentals_count')
          .group('cars.id')
      }
  scope :in_category, -> (category_id) { where(category_id: category_id) }

```

now we can do something like

```ruby
car = Car.with_rentals_count.all
c.rental_counts
```

scope is just a self method! its like scope: test, -> .. / def self.test / self << class def test
Scope works only when Aplied on class or when many relationship
User.in_category.last
X.users.in_category.last
X.user.in_category (x WONT WORK)

thats why scope are mainly used just for isolationg search, not for adding extra ttrubites or use User.in_category.where(x_id: X.id)

sif we have too many scopes! It will be good to have them on their own module!
include BidItem::Scopes

### 5 Controllers

#### 5.1 CRUD

a controller is a class that contains method! each method is an acount that fire when u hite a route

each mothod can access a params variable coming from ... !

curd example for the route /api/v1/teams/<team_id>/players

this controlelr should be on the location controller/api/v1/playersController.rb
because on the router name space, se the router

and there for the controller name should be Api::V1::CarsController

put routes before controller

```ruby
# app/controllers/api/v1/players_controller.rb
class Api::V1::PlayersController < Api::V1::BaseController
def index
players = current_team.players
total_count = players.count
players = players.parse_include(include).paginate(params).ordered(params)
players = SerializableResource.new(
players,
each_serializer: V1::Super::ServiceOrderSerializer,
include: include,
)
render array_response(data: players, total_count: total_count)
end

def destroy
player = SerializableResource.new(
current_player,
serializer: V1::Super::ViewingReportSerializer,
include: include,
)
current_player.destroy!
render single_response(data: player)
end

def create
create_params = Player.super_create_params(params.require(:player))
player = current_team.players.create!(create_params)
player = SerializableResource.new(
player,
serializer: V1::Super::ViewingReportSerializer,
include: include
)
render single_response(data: player)
end

def update
current_player.update!(update_params)
player = SerializableResource.new(
current_player,
serializer: V1::Super::ViewingReportSerializer,
include: include
)
render single_response(data: player)
end

def show
player = SerializableResource.new(
current_player,
serializer: V1::Super::ViewingReportSerializer,
include: include
)
render single_response(data: player)
end

# Private controller methods

private

def current_team
Team.find(params[:team_id] || params[:id])
end

def current_player
Player.find(params[:player_id] || params[:id])
end
end
```

#### 5.2 include & parse_include

`include` is coming from `Api::SuperAdmin::V1::BaseController` (check this)

```ruby
  def include
    # Safetynet because double wildcard will easily create infinite serialize loops
    (params[:include] || '').gsub('**', '*')
  end
```

set `include` manually or to `include: []` on case to public routes.

`parse_include` , take assossiations from the include parmas and eger load them so the serizer wont have n+ query problems in case of each_serializer

#### 5.3 pagination

pagination and ordreing functionalities are comming from
`include Paginateable`
`include Orderable`
there are also included in ActiveStorageAttachmentExtension

This how request params should look like for order and paginate

```ruby
{
  order:   'desc',
  orderBy: 'created_at',
  page:    this.bidItems.meta.nextPage,
  limit:   this.bidItems.meta.limit,
}
```

#### 5.4 Params handleling

`Car.super_create_params(params.require(:car))`, validate the params coming from a controoler when creating or updating a record

`where is safeParams and what does it do`

```ruby
#for create and update action, we need to add a class method validator like so
Class Player
  # create a class method
  class << self
    def create_params(params)
      process_params(params)
    end

    private
    def update_params(params)
      safeParams(params).permit(:name, json_data: [:x, :y])
    end
  end
end

# this make sure that selected_service_partner_ids is arrays
params.permit(selected_service_partner_ids: [])

#require and permit nested
def public_params
  params.require(:extra).require([:bid_item_id])
  params.require(:broker_id)
  params.permit(:broker_id, :auth_this_device, :ssn, extra: [:bid_item_id])
end

```

#### 5.5 reponses

findh! and create! already return bad request errors if the validation faild and the record were not found

```ruby
we can use inside the controller
raise ActionController::ParameterError, 'Invalid latitude or longitude'
raise Exceptions::BadRequest.new 'invalid phone or email'

create! and update! and findhh! already return its expression

#renders, (single_repose and array_response does this under the hood)
render json: {}, status: :bad_request

#status can also be11
:ok (200)
:created (201)
Etc…

send_data FILE_from_store_or attachment, type: 'image/svg+xml', disposition: 'inline'

single reponse and array response

```

#### 5.6 Auth

```ruby
class Api::Web::V1::PublicBaseController < Api::V1::BaseController

  def current_broker
    @broker ||= Broker.findh!(params[:broker_id] || params[:id])
  end

  def require_public_search_enabled
    @broker = Broker.where(public_search_enabled: true).findh!(params[:broker_id] || params[:id])
  end
end

class Api::Web::V1::BidItemsController < Api::Web::V1::PublicBaseController
  before_action :require_public_search_enabled, only: [:index]
  skip_before_action :authenticate

  def index
    params = public_params

    bid_items = current_broker.bid_items.params_filter(params)

```

#### 5.7 life cercle

```ruby
before_action :validate_draft_param, only: [:create, :update]
The action should be clean and not include extra logic
Extra logic should be handle separately, for example if we wanna also only updates for record with a column draft: true.

def validate_draft_param
  #5555
end
```

and if u wanna do something when a record is created or updated, better use hooks

### 6 Validators

validates_inclusion_of :gender, in: ['male', 'female']

#### 6.1 Msss

```ruby
#  You can add EmailValidator just like app/validators/UrlValidator.rb
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add(attribute, 'is not valid') unless value.email?
  end
end
validates :email, presence: true, email: true #<- then add this to the Model Class
validate_uniqueness_of :attribute
validates :name, presence: true, length: {minimum: 1} //use validates_presence_of with other things
validates_presence_of :name, :email
validates_uniqueness_of :username, case_sensitive: false // unique among all existing records
validates_length_of :title, maximum: 100
validates_numericality_of :price
validates_format_of :email, with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
validates :display_name, presence: {message: '...'}, if: -> { name.blank? } //instead ofusuing Proc
validates :link, url: true, unless: Proc.new { self.link.blank? }


ActionController::Parameters already provides built-in protection against SQL injection attacks through its strong parameters feature. When you use the permit method on a params object, Rails automatically filters out any parameters that are not explicitly permitted and sanitizes the values to prevent SQL injection attacks.

# Permitting selected_service_partner_ids as an array def service_params params.require(:service).permit(selected_service_partner_ids: []) end
rubyCopy code
# Permitting selected_service_partner_ids as a single value def service_params params.require(:service).permit(:selected_service_partner_ids) end


trimming a value or something like that should be before validation

# using shena; mostly to validate jsonb attribites
# we use proc only if we wanna use sode script inside the class
validates :hash_attribite,
          json: {
            schema:  Proc.new {
                       Rails.root.join('app','models','schemas',"#{self.name}.json")
                     },
            message: ->(errors) { errors }
          }

# or we can use simple methods! But its not good way
validate :validate_vitec_realtors_filter, :validate_mspecs_realtors_filter

def validate_vitec_realtors_filter
  errors.add(:realtors_filter, "archived should be always false'") if realtors_filter[:archived] != false
  if realtors_filter[:title] && !realtors_filter[:title].is_a?(Array)
    errors.add(:realtors_filter,"mubt be be an array'")
  end
end


with message and a statement/ the if can be also include with hoooks
  validates :name, presence: { message: "Name can't be blank" }
   validates :display_name, presence: { message: "" }, if: -> { name.blank? } with if

in rails class we can use if in two ways
using this syntax if: -> { display_name.blank? }  vs  if: Proc.new { self.link.blank? }

//the schema validator run only with update! create! not update create

```

#### 6.2 advanced

```ruby

•	ails have many validators like
validates_presence_of
validates_length_of

but the method validates alone can be so custimazed and u can do multiple validators just on it like validates :name, presence: true, length: {minimum: 1}
the customization that the method validates accept

:acceptance: Validates that a checkbox or radio button was checked when a form is submitted.
•	:confirmation: Validates that two fields match, typically used for password confirmation fields.
•	:exclusion: Validates that the attribute is not included in a given set of values.
•	:format: Validates the format of the attribute using a regular expression.
•	:inclusion: Validates that the attribute is included in a given set of values.
•	:length: Validates the length of the attribute. You can specify :minimum, :maximum, and/or :is options.
•	:numericality: Validates that the attribute is a number, and can specify additional constraints like :greater_than, :less_than, and/or :only_integer.
•	:presence: Validates that the attribute is present and not blank.
•	:uniqueness: Validates that the attribute is unique among all instances of the model.

class Person < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validate :custom_validation_method

  private

  def custom_validation_method
    errors.add(:base, "This person is not valid") if name == "Invalid"
  end
end

some methods can take nested config
ex:
validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }

```

json validator scheme has a problem which is it does not accept null even if the column is nullbale on the db level

go fix ti
validates :grafs,
json: {
...
},
allow_nil: true

but its just better to give the json column default values

### 7 Serializers

#### 7.1 overview

```ruby
class V1::Super::CarSerializer < V1::Super::BaseSerializer
  attributes :name,
             :id,
             :rentals_count,
             :logo,
             :rentals_count

  # we can also show an atrubite base on a condition
  attribute :private_column, if: :is_admin?

  # we can also show a custom value
   attribute :format_price

  # and we can also return the current object assossations
  belongs_to :manufacturer, serializer: V1::Super::ManufacturerSerializer
  has_many :xxxs, serializer: V1::Super::ManufacturerSerializer

  def logo
    object.photo.signed_url
  end

  # attrubites by a custom select or scopes etc..
  def rentals_count
   object.try(:rentals_count)
  end

  def formated_price
    return object.price + "kr"
  end

  def is_admin?
    object.admin
  end

end
```

the assossiations like manufacturer will be returned only if passed on include params like so include="‘manufacturer’

and to trigger another assotion in the manufacturer serializer like owener we can do include="manufacturer.owner"

manufacturer or any assossiation has to be included in the parse_include on the controller to avoid n+1 query (look at controller -> index method)

id from serializer will always return a hashed id, it always better to add add_column hash_id, :string, null: true on any new created model migraton!

the hash_id is being set on the HashIdentifiable that is included in both ActiveStorageAttachmentExtension and application record after ctreating a new record

it also makes it possible to use some extra modules included to baseControler that inherite aplication record like findh! and fond_by_id_h!

there method are helpful because they return 404 if value notg found without handeling aline

#### 7.2 Pass arguments

```ruby
# in the controller
terms_and_conditions = SerializableResource.new(
  terms_and_conditions,
  each_serializer: V1::Super::TermsAndConditionsSerializer,
  include:         [],
  with_text:       with_text
)

#in the serilizer
class V1::Super::TermsAndConditionsSerializer < V1::BaseSerializer
  attributes :id, :created_at, :draft, :published_at
  attribute :integrity, if: :with_text?

  def with_text?
    instance_options[:with_text]
  end
end
```

### 8 Routes

```ruby
namespace 'api' do
       namespace 'super_admin' do
           namespace 'v1' do
             # specify the teams routes
             resources :teams, only: [:index] do
              # many to many
              resources :players, only: [:index, :show]
             end
          end
        end
    end

```

it will create these routes
| Route | Controller Action |
|---------------------------------------|----------------------|
| /api/v1/teams | index |
| /api/v1/teams/<team_id>/players | index |
| /api/v1/teams/<team_id>/players/<player_id> | show |

```
this routes will trigger the controller on /app/controllers/api/super_admin/v1/brokers_controller.rb
--> controller should be always plural
--> this is how the controller must look like
class Api::SuperAdmin::V1::BrokesController < Api::SuperAdmin::V1::BaseController




# add extra route
resources :users, only: [:index, :show, :update] do
   get ':user_id/integration_leads', on: :collection,
                                     action: :fetch_external_leads,


# specify another controller
# the the controlelr shouyld be brokers_controller but we wanna use another one
resources :brokers, only: [:index], controller: :bank_brokers

```

---

unit test on the portal! FactoryBot, what is it , and provide some example ?

chat gbt expleain all delegate cases in rails

---

```ruby
study more about actice storage sttachmnet and active storage blob the relation
between them,
```

### 9 Mailer

```ruby
Create a mailer class (specifie where add!!)
class Brokers::ViewingReportMailer < ApplicationMailer

def viewing_report_created(attachment_id, email, subject)
    @test = 123 #all values with @ will be avaible in the trample
    file = ActiveStorage::Attachment.find(attachment_id)
    attachments['test.pdf'] = file.download
     mail(to: email, subject: @subject, template_name: 'bank_portal')
  end

end

#we can switch template with a simple body or nothing at all
mail(to: email, subject: subject, body: 'hello')
mail(to: email, subject: subject)

now or any other controller or class
ViewingReportMailer.viewing_report_created(attachment.id, email , subject ).deliver_later unless email.blank?


----  test a mailer
create a new file under specs/mailers/previews
class Brokers::ViewingReportMailerPreview < ActionMailer::Preview
    def viewing_report_created
      attachment_id = 1352258
      email = '68kenichi@gmail.com'
      subject = 'viewing report'
      Brokers::ViewingReportMailer.viewing_report_created(attachment_id, email, subject)
    end
  end
  #the action mailer is defined on app/mailers

All : https://guides.rubyonrails.org/v3.0/action_mailer_basics.html

How to configure mails !

```

### 10 Workers

see viewing report

### 11 Schedular Jobs

We need to use sidekiq-cron It is a scheduling add-on for sidekiq.
a cron is a time-based job scheduler in Unix-like computer operating systems.

gem "sidekiq-cron" #add the gem to the Gemfile of your rails app.
bundle install #run this on the terminal to install the new added gems

Then create a file called schedule.yml under the config directory. Inside that file, add the following:
my*first_job:
cron: "*/5 \_ \* \* \*"
class: "NameWorker"

Now create another file called sidekiq.rb inside config/initializers of your app. Add the following code to that file:

```ruby
schedule_file = "config/schedule.yml"
    if File.exist?(schedule_file) && Sidekiq.server?
       Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
    end



```

Now its time for you to create the actual worker. For that go to the terminal and type
rails g sidekiq:worker NameWorker #This will create a file workers/name_worker.rb

Now add the logic to the worker class
class WorkerName
include Sidekiq::Worker

      def perform()
        # Add your code here.
      end
    end

Perform is the function that gonna fire on the scudlar

And finally to manually test the worker run:
GenerateViewingReport.new.perform

### 55 unknown

handle logo update both url or file, should be in attachment part

```ruby
def update
  update_params = Car.super_update_params(params.require(:car))

  logo_url = update_params.delete(:logo) if update_params[:logo] =~ /\A#{URI::regexp(['http', 'https'])}\z/

  current_car.update!(update_params)
  #take a look at active storage extention etc..
  current_car.logo.attach_url(logo_url) unless logo_url.blank?

  current_car = SerializableResource.new(
    current_car,
    serializer: V1::Super::ServicePartnerSerializer,
    include:    include
  )
  render single_response(data: current_car)
end
```

---

Module vs convern!
both can be included in the Model using include

Modules with concerns makes add keywrord sto a class like scope and so on cuz it support included
module M
extend ActiveSupport::Concern

included do
scope :disabled, -> { where(disabled: true) }
end
end

now if we include t his module in the Class it will have that scope, while normal Modules can makes us only add methods to a class!

### 100 More url Orm and sql for practice

//simple orm and how they are structred
///active record examples
bid_item = Broker.where(public_search_enabled: true)
.findh!(login_params[:broker_id])
.bid_items
.where(status: [:for_sale, nil])
.findh!(login_params[:bid_item_id])

//where using joins
BidItem.joins(:broker) broker not broker because biditem has_one: broker
.where({status: [:for_sale, nil], broker: {public_search_enabled: true}})

In rails many methods have similar method that ends with ! ex: find and find!
methods that ends with ! will raise ActiveRecord::RecordNotFound exception if no record found matching the passed argument

The method find can also accept and array! And there is another called find_by that return first matching as well

BidItem.joins(:speculators).where(speculators: {checkout: true}).group('bid_items.id').count --> {41510=>15}
BidItem.joins(:speculators).where(speculators: {checkout: true}).group('bid_items.id')
--> 15 result (15 specuptor with same bid_item)
BidItem.joins(:speculators).where(speculators: {checkout: true}).distinct.count  
---> 1

ViewingTimeSlot.select('starts_at').reorder(Arel.sql("ABS(EXTRACT(EPOCH FROM (viewing_time_slots.starts_at - NOW()))) ASC")).first(5)

Using .first will automatically add ASC (overwrite it) and .last will add .DESC

For increasing performance, we should add the query in the order in select and

… as time_diff).order(time-time)

reorder is used to overwrite any order caused by scopes

condition = params[:checkout].to_bool ? 'EXISTS' : 'NOT EXISTS'
result = result.where(
"#{condition} (:subquery)",
subquery: Speculator.select('1')
.where('speculators.bid_item_id = bid_items.id')
.where('speculators.checkout = true')
)

we can also use ? ? , 1,2

//
see all old query! and viewing report one

//-----
@posts = Post.all
@comments = []
@posts.each do |post|
@comments << post.comments
end
This will generate one query to load all the posts and then one query for each post to load its comments, resulting in N+1 queries (where N is the number of posts).

To avoid this issue, you can use the includes, preload, eager_load, and joins methods to load the associated records in a single query, like this:

Copy code
@posts = Post.includes(:comments)

# or

@posts = Post.eager_load(:comments)

Using the joins method alone does not avoid the "N+1" issue.
joins method filters the main model based on the associated records,
but it does not load the associated records themselves in a single query.

so we can use both like so

items = BidItemDetail.includes(:bid_item).joins(bid_item: [:broker])
use includes here only if we need the assosation bid_item of each record for future use
like looping throu a loop and displaying them so we will avoid an extra query for each record!

SELECT bid*item_details.*, bid*items.* //with includes
SELECT bid_item_details.\* /without includes
--rest
FROM bid_item_details
INNER JOIN bid_items ON bid_items.id = bid_item_details.bid_item_id
INNER JOIN brokers ON brokers.id = bid_items.broker_id

eager_load and includes are similar in that they both allow
for the eager loading of associated records. The difference
is that eager_load is more flexible and allows for more
fine-grained control over which associations should be eager
loaded, while includes will eager load all associations specified in the query.

here is the example

User.includes(:comments, :posts) //will always laod them no matetr what

Let's say you only want to eager load comments which are approved and you don't
want to load all comments associated with the user:
Copy code
User.eager_load(comments: :where.not(approved: false)).eager_load(:posts)

Another example would be loading only the last 10 posts of the user:
Copy code
User.eager_load(posts: :limit(10))

bid_item = self.bid_item
return unless bid_item.broker.public_search_enabled && bid_item.home_journey
i wanted to created an instance of bid_item so i dont execute two queries on that check!

it might be 2 queries but the second one will take 0ms because its cached

also bid_item = self.bid_item doesnt execute the query. Rails doesn't execute until you use the model

//
#orms used most on controlelrs / maybe more it to orm
#we dont need .save here! the block will be exucuted only if created
speculator = bid_item.speculators.find_or_create_by!(client_id: client.id) do |speculator|
speculator.phone = phone
speculator.email = email
end

# bid_item.speculators.joins(:client).find_by('client.ssn': data[:ssn])

bid_item.speculators.joins(:client).where('client.ssn': data[:ssn]).first

client = Client.find_or_initialize_by(ssn: data[:ssn])

if client.persisted?

# client was found in the database

else

# client is a new (unpersisted) object

end

we can also use client.new_record?

speculator = Speculator.find_by("name LIKE ? AND email IS NOT NULL AND phone IS NOT NULL", "%#{name}%")
if speculator.present?

# speculator was found

else

# speculator was not found we can also use if speculator.nil?

end

speculator = Speculator.find_or_create_by(name: "John Smith", email: "johnsmith@example.com") do |speculator|
#apply change if spuc exits \*remember no need to .save here!
speculator.phone = '123456'
end

#id we are working outside of controller! And we need to work with records!
@client = Client.new(params[:client])
client.new_record? //true
if @client.save
client.persisted? //true
return response

find_or_create_by!
find_or_initialize_by !

belongs_to :broker
has_and_belongs_to_many :brokers

caching mechnaism

https://github.com/BudID-Technologies/budid-api/pull/247

they acually caches but they return a new object that has a new refrence each time! that why we used class intance variable @ to create a global variable that hilds the same instance!

how to use like in orm! betetr use pgsearch! learn about it
Topic.where("name like ?", "%apple%")
but we usually use something like pgSearch

broker&.parsed_theme.dig(:logo)
We use &. For class attrubites and dig for hashes values!
&. Is similar to .try(:parsed_theme)

Nested select
teams.where('EXISTS (SELECT 1 FROM players WHERE players.team_id = teams.id AND Height > ..)')
using ORM

teams.where(Player.select(1).where("team_id = teams.id").where("height > 180").exists)

we can also use it for select_add(Biditem.where().first as “xx” )

User.find_or_create_by(name: 'John Doe') do |user|
user.email = 'john@example.com'
end
the block will be exucutude only in case if create not find

put this under sql too
sql
will get all todays records
.where('starts_at::date = ?', Date.today)

if we use starts_at which is a timestamp! we need to have a where starts_at > ? and ends_at < ? [Date.today.beginning_of_day, d...end_of_day]

---

check new record or if sometimes has changed!
viewer.save if viewer.changed?
instance.new_record?

TermsAndConditions.select(:draft, :created_at, :hash_id).all
end
total_count = terms_and_conditions.count
will crash!
select should always go after count if its not select.\* by default

exits with where in orm! And how can we use find by instead
...where(...).exits? copare it with the methods i used before with exits

this is what it does
BankUser.where(role: "s").exists?
SELECT 1 AS one FROM "bank_users" WHERE "bank_users"."role" IS NULL LIMIT $1

So we can either use
User.where(user_name: “4k”).exits? or User.where(user_name: “4k”).length or better
User.find_by(name: “4k”) or even find_by!(..) will return execption on cotroller

 Select without
with_text = false
terms_and_conditions = TermsAndConditions.all
total_count = terms_and_conditions.count

    terms_and_conditions = terms_and_conditions.select_without(:integrity, :terms) if with_text

---

BankUser.super.find_by(id: 33).present?

if we dont have enum we can use
BankUser.where(role: super).find_by(id: 33).present?

usually
BankUser.where(role: super, id: 33).count > 1

pluck does not return an object of keys
for example
xx.pluck(:id, :draft) # [2, false]
xx.pluck(:id) # 2

so it return a single value or an array
so just use select

### 109 Hooks

Hooks are good to perform side querueis when a record is created or updated etc..
for example! We can set a hash_id before eeach record before its created

first we create a module for the hooks and include it like so
include HomeJourney::SpeculatorHooks

and this is how the module should looks like

module HomeJourney::SpeculatorHooks
extend ActiveSupport::Concern

included do
after_create :home_journey_public_upsert, if: Proc.new { self.phone.present? }
after_update :home_journey_public_upsert,
if: Proc.new { self.saved_change_to_phone? && self.phone.present? }
private
def home_journey_public_upsert

3 Available Callbacks
Here is a list with all the available Active Record callbacks, listed in the same order in which they will get called during the respective operations:
3.1 Creating an Object
• before_validation
• after_validation
• before_save
• around_save
• before_create
• around_create
• after_create
• after_save
• after_commit / after_rollback
3.2 Updating an Object
• before_validation
• after_validation
• before_save
• around_save
• before_update
• around_update
• after_update
• after_save
• after_commit / after_rollback
3.3 Destroying an Object
• before_destroy
• around_destroy
• after_destroy
• after_commit / after_rollback
3.4 after_initialize and after_find
3.5 after_touch

4 Running Callbacks
The following methods trigger callbacks:
• create
• create!
• destroy
• destroy!
• destroy*all
• destroy_by
• save
• save!
• save(validate: false)
• toggle!
• touch
• update_attribute
• update
• update!
• valid?
Additionally, the after_find callback is triggered by the following finder methods:
• all
• first
• find
• find_by
• find_by*_
• find*by*_!
• find_by_sql
• last
The after_initialize callback is triggered every time a new object of the class is initialized.

The validate one accept an extra params

# :on takes an array as well

after_validation :set_location, on: [ :create, :update ]

rollback understand:
Speac.last(5).each{ s s.destroy! }
if 4 were delted and last crashed then db will fall back and never delete the other
same with hooks

how saved_change_to_phone? works! q in concerns
concern run when a new record is added deleted persisted etc..
persisted is not the same add added

Add concerern from speculator hook , remember after_create will rollback if an error happen and the record will never be stored, because its not after persist (ex: if a user is added! U wanna run a corener that does something! If the concern failld the user wont be written to db! )

These hooks class sould be defined in the concerns foler

before_save / after_save
save is triggered whenever data is being saved to database. So .save, .update etc

--changed to
saved_change_to_attribute? is a predicate method that returns true if the attribute has been changed and saved to the database since the record was loaded from it, even if the change hasn't been committed to the database yet. It works during the after_save callback and later stages of the object lifecycle.

will_save_change_to_attribute?, on the other hand, is a predicate method that returns true if the attribute is going to be changed and saved in the next save operation, but hasn't been saved yet. It works during the before_save callback and earlier stages of the object lifecycle

--
Active Record Callbacks — Ruby on Rails Guides

Acrive storage
Memory
Progress
When request send why it put the file on temp if it's already stored by memory
Can we creat a way that write steam to disk where memory has to read a chunk of 5mb and save it to memory

https://unix.stackexchange.com/questions/137888/advantages-to-uploading-files-to-tmp-before-moving-off-to-permanent-storage

bank.update(logo: file) where file is comming from form data! see controller
or
bank.logo.attach_url()

Orm
Rails eager_load with inner join | Toshimaru’s Blog
Ruby on Rails - OWASP Cheat Sheet Series

How to raise exeption
raise Exceptions::BadRequest unless ids.is_a?(Array)
This will finish the controller

Rendring controller with pdf kit
class ViewingReportRenderingController < RenderingController
helper ReportHelper
end

    html = ViewingReportRenderingController.new.render_to_string({
      template: 'reports/viewing_report',
      locals:   {
        name: “anas”
      }
    })

    kit = PDFKit.new(
      html,
      {
        'enable-local-file-access':  true,
        'load-error-handling':       'ignore',
        'load-media-error-handling': 'ignore',
        'custom-header-propagation': true,
      }
    )

    filename = "#{Time.now()}-viewing-report.pdf"
    filepath = "/tmp/#{filename}"

    file = kit.to_file(filepath)

now on the erb file we can access locals and every method in the helper function

--
If we ont need methods on the erb file we can just use RenderingController
class RenderingController < AbstractController::Base
include AbstractController::Rendering
include ActionView::Layouts
include AbstractController::Helpers
include AbstractController::Translation
include AbstractController::AssetPaths
include Rails.application.routes.url_helpers

self.view_paths = 'app/views'
end
or we can declare all the method inside the erb file lise so

<%
Def test
end
%>

Jobs
Run something in the background

ActionDispatch is a module in Ruby on Rails that is responsible for handling the incoming HTTP requests and dispatching them to the appropriate controller action. It provides a number of features, including:

URL routing: mapping URLs to controller actions
Parameter parsing: extracting parameters from the request body and query string
File uploads: handling file uploads from the client
Middleware support: executing middleware before and after the request is processed by the controller action
Exception handling: handling exceptions that occur during the request and generating error responses
