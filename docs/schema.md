# Schema Information

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
first_name      | string    | not null, indexed
last_name       | string    | not null, indexed
email           | string    | not null, indexed, unique
password_digest | string    | not null
session_token   | string    | not null, indexed, unique
image_url       | string    |

## courses
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
title       | string    | not null
description | text      | not null
map         | JSON      | not null
user_id     | integer   | not null, foreign key (references users), indexed

## charts
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users), indexed
course_id   | integer   | not null
description | string    |
start_date  | date      | not null
chart_stats | JSON      | not null
chart_map   | JSON      | not null
