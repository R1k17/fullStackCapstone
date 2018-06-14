==== Step-by-Step ====
>> weekDay creation <<
> add shift button value is set to parent day ID >> value = day.ID
> create shiftArray >> day1 = [], day2 = []

>> add shift <<
> set array length as new ID
> add shift to array


day1 
  > [x] add ID to day container
  > [x] add ID to shifts
day2
  > [x] add ID to day container >> day1 ID !== day2 ID
  > [] add ID to shifts
      format: d2s1, d2s2, d2,s3
      [] starts with d2s1
      [] only adds shift to day 2


==== Client ====
A client is a computer or a program that, as part of its operation, relies 
on sending a request to another program or a computer hardware or software 
that accesses a service made available by a server.

For example, web browsers are clients that connect to web servers and 
retrieve web pages for display.

The client-facing web application is running HTML, CSS, and JavaScript. 
Client-facing apps require two things: a way to retrieve initial HTML, CSS, 
and JavaScript to run the app and API endpoints that expose needed resources.

==== Integration test ====
So far, we've seen how to write unit tests for small pieces of code. 
In this assignment, we dive into integration testing. Integration tests 
target an app's HTTP layer, and, as such, test and document how clients 
will interact with your API.
