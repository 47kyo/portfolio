### 1. FUNCTIONS

#### 1.1 overview

```ruby
age = 23    # local variable”.
AGE = 23    # constant
```

```ruby
def func1
  a = "Hello!"
  a
end

puts func1()     # Hello!
puts func1       # also valid syntax if we dont have any arg to pass
```

**note:** we can use `return` inside a function to exit the function and return a value but functions by defualt return the last line operation.

#### 1.2 parameters

```ruby
def func1(x)
def func1(x = 10) # with default value

#call it
func1(1)
func1 1     # other way to pass argument
```

#### 1.3 named parameters

```ruby
def func1(name:, age:)
def func1(name: "Anas", age:"24")   # with default value
#call it

func1(name: "a", age: 33)
```

#### 1.4 how to name function

function that return booealns that have a ? at the end is

```ruby
def is_five?(num)
  num == 5
end
```

---

### 2. CONDITIONS

#### 2.1 CASE

```ruby
case value
  when "a"
    return handleVitecKeys....
 when "b" , “c”
   return handlMspecsKeys....
 else
   return unrecognizedProvider
end
```

#### 2.2 IF STATMENT

```ruby
if condition1
  # do something
elsif condition2
  # do something else
else
  # no condition
end
```

#### 2.3 ONE LINE STATMENT

somethines it may get too ugly and long, a better way to use the help of arrays

```ruby
return 'Ja' if ['yes', 'ja', 'true'].includes?(value.downcase)
return 'Ja' unless ['yes', 'ja', 'true'].includes?(value.downcase)

return 40 > 100 ? "Greater than" : "Less than"
```

---

### 3. hoisting and scoping

in ruby variables are hoisted (decalted in the begging of the function scope and assigned to nil)

```ruby
def func
  if true
    x = 5
  end
puts x # 5
end
```

here as that a variable created ibside an if statment is accepbile in the fuction

---

### 4. CLASSES

#### 4.1 overview

In Ruby, a class is a blueprint for creating objects. It contains methods and variables that define the behavior and characteristics of the objects created from the class.

```ruby
class Dog
  def initialize(name)
    @name = name
  end

  #a method that works as a getter
  def name
    @name
  end

end

dog = Dog.new("Fido")
puts dog.name # prints "Fido!"

```

#### 4.2 attr helpers

`attr_reader`, `attr_writer`, and `attr_accessor`: These methods allow you to easily define getter and setter methods for your instance variables.

```ruby
class Dog
attr_reader :name

  def initialize(name)
   @name = name
  end
end

dog = Dog.new("Fido")
puts dog.name # prints "Fido!"

```

#### 4.3 variables types

```ruby
age = 23    # local variable”.
$age = 23   # global variable
@age = 23   # instance variable
@@age = 23  # class variable
AGE = 23    # constant
```

#### 4.4 class/prototype methods

```ruby
class Dog
  @@number_of_dogs = 0

  def initialize(name)
    @name = name
    @@number_of_dogs += 1
  end

   #class method
  def self.number_of_dogs
    @@number_of_dogs
  end

  #another syntax
  class < self
    def number_of_dogs
    @@number_of_dogs
    end
  end

end

dog1 = Dog.new("Fido")
dog2 = Dog.new("Buddy")

puts Dog.number_of_dogs # prints 2
```

#### 4.5 private methods

```ruby
class Dog
  def initialize(name)
    @name = name
  end

  # any metthod defined under the keyword private wil be a private method
  private
  # this method is accessible only whithin the class
  def private_method
    name
  end

end
```

#### 4.6 Inheritance:

In Ruby, you can create a class that inherits from another class using the < operator. The subclass (also known as the derived class) will have all the methods and variables of the superclass (also known as the base class). You can then override or add new methods and variables to the subclass as needed.

```ruby
class Animal
def speak
puts "I'm an animal!"
end
end

class Dog < Animal
def bark
puts "Woof!"
end
end

dog = Dog.new
dog.speak # prints "I'm an animal!"
dog.bark # prints "Woof!"
```

**note** if we create speak inside dog it will overwirte the animal.speak

#### 4.7 send and public_send

- when we want to call a function buy its string name or symbox

- send is able to call both public and private methods, while public_send can only call public methods.

```ruby
class MyClass

    def public_method
      "This is a public method"
    end

    private

    def private_method
      "This is a private method"
    end

end

obj = MyClass.new
puts obj.send("private_method") # => "This is a private method"
puts obj.public_send("private_method") # => NoMethodError: private method
```

#### 4.8 self inside a method

---

### 6. Modules

In Ruby, you can use modules to define methods and variables that can be shared across multiple classes. Modules are similar to classes, but they cannot be instantiated and cannot have subclasses. To include a module in a class, you use the include keyword.

module can direct effect the cllass by adding methgods and interfacting with its attrubites

modules can access accesile the class that its includd on methods and variables

```ruby
module GeoSearchable
  extend ActiveSupport::Concern

  #add a simple instance method to the class
  def say_hi
    return "hello " +self.name
  end

  #add hoocks to the class
  included do
    before_save :set_coords
    def set_coords
      return unless self.class.column_names.include?('coords')
      return unless will_save_change_to_latitude? || will_save_change_to_longitude?

      self.coords = Geo.point(lng: longitude, lat: latitude).to_s
    end
  end

  #add a class method to the class
  class_methods do
    def number_of_dogs
      @@number_of_dogs
    end
  end
end

class Dog
 @@numberofdogs
include Swimmable
end

fish = Fish.new("Nemo")
fish.g_near # prints "I'm swimming!"
```

**note** if we create say_hi inside dog it will overwirte the module.say_hi, the sane thign gods for class methods

---

### loop

```ruby
10.times { puts "hello" }
10.times { |i| puts "hello #{i}" } #with index
(1..10).each { |i| puts i } #range loop
1.upto(5) { |i| puts i } #simillar to range

    #While loop
    n = 0
    while n < 10
    puts n
    n += 1
    end

    #until loop (reversed of while)
    bottle = 100
    until bottle < 10
    puts bottle
    bottle -= 1
    end

    #skip
    10.times do |i|
    next unless i.even?
    puts "hello #{i}"
    end

```

---

### number methods

```bash
number.zero?
number.positive?
number.negative?
number.odd?
number.even?
```

---

### strings methods

this need a good clean up with chatgbt

**note:** Strings are Immutabile

Just import things here, a list of all method can be found on :
https://ruby-doc.org/core-3.1.2/String.html

```bash
.downcase
.upcase
.empty?
.start_with?(arg)
.end_with?(arg)
.include?(arg)
.match?(/\A-?\d+\Z/) # check if its a valid number
.index(arg)  #
.strip # to trim the string
.string[0,3] #sub string
.delete_suffix(arg)
.count(arg) #count number of sub words
.gsub(rg, "b") #change all (arg) to b
.gsub(/\w+/) { |word| word.capitalize } #capitlize every word

.chars # returns array of chars
.each_char { |ch| puts ch } #loop through the string char by char
.split(",") #returns array of split words

.size # returns number of how many chars on the string
.length #It executes same length method internally.
```

**note** for things like `start_with` etc.. better use rgex `match`, its more flexibale.

Conctination - Interpolation
"Hello" + "world"
"Hello" + 10 => ERROR
"Hello #{10}"

Append (mutatabile)
string << "hello"

---

### Arrays:

list of all methods can be found on => https://ruby-doc.org/core-2.7.0/Array.html

Arrays in ruby are reference values just like JS

```ruby
numbers = [1,2,3]

numbers[1] # 2
numbers[4] # nil
numbers.first # 1
numbers.last # 3
numbers[-1] # 3 (js have .at(-1))

numbers.size # 3 (the same as .length)
numbers.count #3
numbers.count { |n| n > 1 } # 2 (most used case of count)

numbers << 4 # the same as push method
numbers.push(4)
numbers.pop
numbers.unshift
numbers.shift

numbers.delete_at(0)
numbers.insert(2,9) #insert 9 in position 2

numbers.is_a?(Array) #true
numbers.include?(2) #true
numbers.empty? #check if the llength is 0 similar to (.size.positive?)

numbers.sort #returns a new array
numbers.uniq #delete deplicates (returns a new array)
numbers.sample #return a random element from the array
numbers.compact #remove all nil values (modifies the original array)

numbers.join #123 default arg is ""
numbers.join("-") #1-2-3

```

#### Iterating through arrays

```ruby
numbers.each{ |item| puts item }
numbers.each_with_index{ |item, idx| puts "#{item} with index #{idx}" }
numbers.map { |user| user.capitalize } # map returns a new array
numbers.map.with_index { |user,index| user.capitalize }

#Concatination
numbers.push(\*[5,6])
numbers.concat([5,6])
numbers += [5,6]

array = [1,2,3,4,5]
array.fill(12, array.size, 4)

# => [1, 2, 3, 4, 5, 12, 12, 12, 12]
```

```ruby
    #breaks (to stop a loop) with a for loop exeample
    arr = ["GFG", "G4G", "Geeks", "Sudo"]
    for element in arr do
        break if element == "Geeks"
    end
```

**note**: when it compese to arrays and object ilterating, avoid using return
in ruby return will exit the block unless its a funtion, for example

[].map{ |x| if x return } will exits the the loop! thats why we should use next instead

```ruby
(1..10).each do |a|
  next if a.even?
  puts a
end

#instead use next from map, it works like return, and for each and other loop it works like a skip!
    filtred_emails = realtors.map do |realtor|
      next if any_condition
      realtor[:emailAddress]
#next here will make the map return nil if the conidtion is value, if we use nil the x method will return the first value that called return!
#first this hould be filter map
#this will return nil if condiftion, that’s why use filter map

```

in ruby return exits all the blocks untill the firet function scope

#### Arrays advanced:

```ruby
    #filtring arrays
    numbers.find{ |el| el > 1 }    #returns array of matches values => [2,3]
    numbers.select { |el| el > 1 } # select returns a new array
    numbers.detect { |el| el > 1 }

    .all
    .some
    they can have .with_index

#Conclusion 1) detect - Finds and returns the first element matching condition. 2) select - Finds and returns all the elements matching the condition. 3) find - Finds and returns the first element matching condition. Internally calls detect

    in arr and hash / different between select! And keep if

add slice and add getting two items at the time and add sorting with nil
maybe rails mnethod can have adiffrent color to sperate them
```

### Hashes:

lis of all methods can be found on => https://ruby-doc.org/core-3.1.2/Hash.html
Hashes in ruby are refrence values just like JS
A hash is like a dictionary. It helps you match two values together

```ruby
fruits = { coconut: 1, apple: 2, banana: 3 }

fruits[:orange] = 4
fruits[:orange] # =Xd try with indefrent access
fruits[:peach] # nil

fruits.empty?
fruits.clear # remove all key-value pairs from hash
fruits.keys # => ["coconut","apple","banana"]
fruits.values # => [1,2,3]

fruits.size
fruits.length
fruits.count
fruits.count { |i,v| v == 1 }

fruits.is_a?(Hash) #=> true
fruits.instance_of?(Hash) #=> true

fruits.merge({ peach: 5 }) #return a new array
fruits.merge({ peach: 5 }) { |key, old, new| [old, new].max } #handle keys conflict
.merge! #modify the original

fruits.select { |key,v| v!=nil } #returns a new hash
fruits.reject { |key,v| v!=nil } #returns a new hash
.select! and .reject! #modify the original hash, but returns nil if no changes were made

fruits.delete_if #Delete every key-value pair from hash h for which block evaluates to true
fruits.keep_if #Delete every key-value pair from hash h for which block evaluates to true

fruits.any? {|k,v| !v.nil?}
fruits.select { |key,v| v!=nil }
fruits.reject { |key,v| v!=nil }

fetch.each { |key,value| puts "#{key} - #{value}" } #iterating throught hash
.each_key and .each_value #loop only through keys or values

#Delete key-value pair and return value from hash whose key is equal to key
fruits.delete(key)

values_att/ keep it on addvancded methods just like .blank? etc..

Hash.map{ |k,v|

     don’t user reutn instead use next


}

in ruby foop looping throught hash and need index we can do
hash.each_with_index { |(k,v),index| }

aldo { |k,v| } is the same as do |k,v| end

params.has_key?(:email) # if the keys exists
params.[:email].present? # if the key is not "" or nill or {} or []

In ruby a lot of method on hashes works only for hash with sym!
.all works only for sym
so we may need to convert others

fruits.values_at(:apple.:banana) # => ["coconut","apple","banana"]

```

#### ilterteing throug objects

```ruby
    #breaks (to stop a loop) with a for loop exeample
    arr = ["GFG", "G4G", "Geeks", "Sudo"]
    for element in arr do
        break if element == "Geeks"
    end
```

**note**: when it compese to arrays and object ilterating, avoid using return
in ruby return will exit the block unless its a funtion, for example

[].map{ |x| if x return } will exits the the loop! thats why we should use next instead

```ruby
(1..10).each do |a|
  next if a.even?
  puts a
end

#instead use next from map, it works like return, and for each and other loop it works like a skip!
    filtred_emails = realtors.map do |realtor|
      next if any_condition
      realtor[:emailAddress]
#next here will make the map return nil if the conidtion is value, if we use nil the x method will return the first value that called return!
#first this hould be filter map
#this will return nil if condiftion, that’s why use filter map

```

in ruby return exits all the blocks untill the firet function scope

#### hashes dig

Dig¨
dig : https://stackoverflow.com/questions/6224875/equivalent-of-try-for-a-hash-to-avoid-undefined-method-errors-on-nil

nil.try(:dig, :id) -> nil
nil.dig(:id) -> error
h.dig(:foo, :zot) -> nil
h.dig(:foo, :zot , :xx) -> nil no error / not sure

deal.try(:dig, nil, :id) => nil
deal.try(:dig, "string", :id) => error (string does not have dig method)

{}.a is nill

#### hashes chaining

myhash&.a&.b

the key_value_by_path is designed to solve the sqame problem that try dig does or a&.b&.c but its more flexibale

#### Digging in ruby and js

stackover flow , try dig and &

still a difference between ruby and js tho
In ruby
nil&.foo no crash
nil&.foo.bar will crash because bar will still run on the result of nil&.foo
In JS
null?.foo no crash
null?.foo.bar no crash

in ruby you cant write
foo.bar on a json, it has to be foo[:bar] and foo&.[bar] doesn't exist

puts nil&.a no crach
puts nil&.a.b crach but puts nil&.a&.b

#### Hash access

paths = {
vitec: 'baseInformation.apartmentNumber',
mspecs: 'estate.apartmentNumber' ,
mäklarhuset: 'apartmentNumber',
}

puts paths[:vitec] same as paths[:”vitec”]
puts paths['vitec'] returns null

h. ).with_indifferent_access

---

### Times

```ruby
Format dates:
string_date = "2022-11-09 09:58:34.073848"
parsed_date = string_date.to_datetime

parsed_date.strftime('%Y-%m-%d') # 2022-11-09
parsed_date.strftime('%Y/%m/%d') # 2022/11/09
parsed_date.strftime('%H:%M') # 09:58
parsed_date.strftime('%U').to_i # week to number

# %U - Week number of the year. The week starts with Sunday. (00..53)

# %W - Week number of the year. The week starts with Monday. (00..53)

Time duration and sql conversion:
(1.day.ago..Time.now).to_s(:db)
Time.now.to_s(:db)
```

---

### Convertaion

#### to_i

```ruby
nil.to_i   # 0
"a".to_i   # 0
Time.now.to_i # time in seconds
```

#### to_b

```ruby
"true".to_b                    # true
"yes".to_b                     # true
"on".to_b                      # true
"t".to_b                       # true
"1".to_b                       # true
"y".to_b                       # true

"any_other_string".to_b        # false
```

### Falsy values

in ruby falsy values are only nil and false

for other things like "" and 0 we should use specific methods like

```ruby
"".empty?  # true
0.zero?    # true
```

# Useful Rails shared methods

\_value.nil?
\_value.present?
\_value.blank?

Here : https://blog.appsignal.com/2018/09/11/differences-between-nil-empty-blank-and-present.html

escaping -->

passing by refrance string when calling their methods -->s

consuming api ->

# modify

a = "XX"
a.downcase #will just retuern xx
a.downcase! # will modify the a to be xx
a&.downcase avoid break in nil

### 1. CATCH ERRORS

```ruby
begin
some_code
rescue
handle_error
 ensure
this_code_is_always_executed
end
```

### 2. Oncat number and string

puts 1+" s" error
puts 1.to_s+" s"

but this can be fixed with the string literl (its really usefull)
puts "#{1}1"

"1" + "1" #”11”
"1".to_i #1
1.to_s #”1”

### Convert types to strung

nil.to_s is embty string
true and false to_s is “true” and “false”
1.to_s is “1”

### the difference between include and extend in ruby

the difference between include and extend in ruby
https://dev.to/abbiecoghlan/ruby-modules-include-vs-extend-vs-prepend-4gmc

### Empty and is_empty

check if empty hash
{}.empty? true
"".empty? true
1.empty? servereror

use empty instead of is_empty > loók for the diffrence

https://blog.arkency.com/2017/07/nil-empty-blank-ruby-rails-difference/

## maybe empty works only for hash and array

You can just do:

@some_var.class == Hash
or also something like:

@some_var.is_a?(Hash)

https://chat.openai.com/c/d494a492-b19c-4942-a68b-f9fa3ece09df

---

class Cat < Animal
def make_sound
super # calls the make_sound method in the Animal class OR make_sound attr if Cat has any in order to avoid infinit loop!
end
end

---
