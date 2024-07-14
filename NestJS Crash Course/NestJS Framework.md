Project description:

![[NestJS Framework 2024-05-15 21.18.42.excalidraw]]

## Overall Objectives
### Objectives: NestJS
- NestJS Modules
- NestJS Controllers
- NestJS Services and Providers
- Controller-to-Service communication
- Validation using NestJS Pipes
### Objectives: Back-end & Architecture
- Develop production-ready REST APIs
- CRUD operations (Create, Read, Update, Delete)
- Error handling
- Data Transfer Objects (DTO)
- System modularity
- Back-end development best practices
- Configuration Management
- Logging
- Security best practices

### Objectives: Persistence
- Connecting the application to a database
- Working with relational databases
- Using TypeORM
- Writing simple and complex queries using QueryBuilder
- Performance when working with a database

### Objectives: Authorization/Authentication
- Signing up, signing in
- Authentication and Authorization
- Protected resources
- Ownership of tasks by users
- Using JWT tokens (JSON Web Tokens)
- Password hashing, salts and properly storing passwords

### Objectives: Deployment
- Polishing the application for Production use
- Deploying NestJS apps to AWS (Amazon Web Services)
- Deploying front-end applications to Amazon S3
- Wiring up the front-end and back-end





# 1. Task Management Application
Creating a nest project:
```bash
nest new nestjs-task-management
```

## NestJS Modules
- Each application has at least one module - the root module. That is the starting point of the application.
- Modules are an effective way to organize components by a closely related set of capabilities (e.g. per feature).
- It's a good practice to have a folder per module, containing the module's components
- Modules are **singletons**, therefore a module can be imported by multiple other modules.

### Defining a module
A module is defined by annotating a class with the `@Module` decorator.
The decorator provides metadata that Nest uses to organize the application structure.

### @Module Decorator Properties
- **providers**: Array of providers to be available within the module via dependency injection
- **controllers**: Array of controllers to be instantiated within the module
- **exports**: Array of providers to export to other modules
- **imports**: List of modules required by this module. Any exported provider by these modules will bow be available in our module via dependency injection.
e.g.:
![[Pasted image 20240515215754.png]]

Code implementation:
![[Pasted image 20240515215945.png]]



## Creating a Tasks Module
Creating a nest module using CLI:
```bash
nest g --help
nest g module tasks
```
Result:
![[Pasted image 20240515220202.png]]

Checking the initialization of the local server with the new module:
![[Pasted image 20240515220305.png]]



## NestJS Controllers
- Responsible for handling incoming **requests** and returning **responses** to the client
- Bound to a specific **path** (for example, "/tasks" for the task resource)
- Contain **handlers**, which handle **endpoints** and **requests methods** (GET, POST, DELETE, etc)
- Can take advantage of **dependency injection** to consume providers within the same module

### Defining a Controller
Controllers are defined by decorating a class with the `@Controller` decorator.
The decorator accepts a string, which is the **path**to be handled by the controller.
```ts
@Controller('/tasks')
export class TasksController {
	// ...
}
```

### Defining a Handler
Handlers are simply methods within the controller class, decorated with decorators such as `@Get`, `@Post`, `@Delete`, etc.

```ts
@Controler('/tasks')
export class TasksController {
	@Get()
	getAllTasks() {
		// do stuff
		return ...;
	}
	@Post()
	createTask() {
		// do stuff
		return ...;
	}
}
```

Flow of HTTP Request Incoming:
1. **Request routed to Controller, handler is called with arguments**
	1. NestJS will parse the relevant request data and will it will be available in the handler
2. **Handle handles the request**
	1. Perform operations such as communication with a service. For example, retrieving an item from the database.
3. **Handler returns response value**
	1. Response can be of any type and even an exception. Nest will wrap the returned value as an HTTP response and return it to the client.

![[Pasted image 20240515221907.png]]


### Creating at Tasks Controller
Creating an Controller with CLI:
```bash
nest g controller tasks --no-spec
```

Result:
![[Pasted image 20240515222153.png]]



## NestJS Providers and Services
### NestJS Providers
- Can be injected into constructors if decorated as an `@Injectable`, via **dependency injection**.
- Can be a plain value, a class, sync/async factory, etc
- Providers must be provided to a module for them to be usable
- Can be exported from a module - and then be available to other modules that import it
### What's a Service?
- Defined as providers. **Not all providers are services**
- Common concept within software development and are not exclusive NestJs, JavaScript or back-end development.
- Singleton when wrapped with `@Injectable()` and provided to a module. That means, the same instance will be share across the application - acting as a single source of truth.
- The main source of business logic. For example, a service will be called from a controller to validate data, create an item in the database and return a response.

e.g.: **Providers in Modules**
![[Pasted image 20240515222931.png]]

```ts
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { LoggerService } from '../shared/logger.service';

@Module({
	controller: [
		TasksController
	],
	proviers: [
		TasksService,
		LoggerService
	]
})
export class TasksModule {}
```



### Creating a TaskService
Creating a Task with CLI:
```bash
nest g service tasks --no-spec
```
Result:
![[Pasted image 20240515223931.png]]

By adding to the controller the service like this, we're making an dependency injection

![[Pasted image 20240515224306.png]]
Running Log:
![[Pasted image 20240515224357.png]]

## Dependency Injection in NestJS
Any component within the NestJS ecosystem can inject a provider that is decorated with the `@Injectable`

We define the dependencies in the constructor of the class. NestJS will take care of the injection for us, and it will then be available as a class property.

```ts
import { TasksService } from './tasks.service';

@Controller('/tasks')
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get()
	async getAllTasks() {
		return await this.tasksService.getAllTasks();
	}
}
```



## Feature: Getting All Tasks
Initially we're saving the tasks into an private array so the only way to access is within the class itself and allow "public" methods to be handled outside. 
![[Pasted image 20240515225337.png]]
In the `tasks.controller` we're calling the `getAllTasks` and returning the list obtained.
Result:
![[Pasted image 20240515225420.png]]



## Feature: Creating a Task
In our service file we've created a new method that create a task of type Task, and then push it to the array of tasks.
![[Pasted image 20240522105217.png]]

Afterwards, in the controller we've created a new controller to handle the POST method which will create an task.
![[Pasted image 20240522105327.png]]

Example:
![[Pasted image 20240522112701.png]]

## Data Transfer Object (DTO)

> A data transfer object (DTO) is an object that is used to encapsulate data, and send it from one subsystem of an application to another.

- Common concept in software development that is not specific to NestJS
- Result in more bullet proof code, as it can be used as a TypeScript type.
- Do not have any behavior except for storage, retrieval, serialization and deserialization of its own data.
- Result in increased performance (although negligible in small applications).
- Can be useful for data validation
- A DTO is **NOT** a model definition. It defines he shape of data for a specific case, for example - creating a task. _interface_ or a _class_

### Classes VS Interfaces for DTOs
- Data Transfer Objects (DTOs) can be defined as classes or interfaces.
- The recommended approach is to use **classes**, also clearly documented in the NestJS documentation
- The reason is that interfaces are part of TypeScript and therefore are not preserved post-compliation
- Classes allow us to do more, and since they are a pat of JavaScript, they will be preserved post-compliation
- NestJS cannot refer to interfaces in run-time, but can refer to classes.

![[Pasted image 20240522110632.png]]

Implementation:
We've created a class called `CreateTaskDto` in the dto folder.
![[Pasted image 20240522111103.png]]

Then we've imported and passed as parameter to the controller.
![[SCR-20240522-kejx.png]]
In the taskService, we've also modified in order to grab the title and description as described below:
![[SCR-20240522-keqm.png]]





## Feature: Get Task by Id

In the second get we're passing as parameter the id which must be done in the `@Get()` in order to use it in the `@Param()` as a variable `id: string` inside our method function.

![[Pasted image 20240522112405.png]]
Afterwards we're calling the getTaskById from the taskService class.
![[Pasted image 20240522112550.png]]
In here we're finding and returning the task from the array.

Sample:
![[Pasted image 20240522112759.png]]



## Feature: Deleting a Task
In the service file we've created a new method that filter all the tasks except the one that we're trying to delete and then updating the list of tasks from this service.

![[Pasted image 20240522112904.png]]

In the controller we're handling the method similar to the get by task Id.

![[Pasted image 20240522112904.png]]

USAGE:

![[Pasted image 20240522112821.png]]

## Feature: Updating a Task
PATCH Best practices:
- Refer to the resource in the URL
- Refer to a specific item by ID
- Specify what has to be **patched** in the URL
- Provide the required parameters in the **request body**

e.g.:
`PATCH http://localhost:3000/tasks/a244fcd3-7b90-4a92-b2bd-4abc264341d5/status`

In the service file we're using the getTaskById and updating the status attribute.
![[Pasted image 20240522114056.png]]

In the controller we're passing two params (the id and the new status)
![[Pasted image 20240522114227.png]]

RESULT:
![[Pasted image 20240522113807.png]]





# 2. Validation and Error Handling

## NestJS Pipes
- Pipe operate on the **arguments** to be processed by the router handler, just before the handler is called
- Pipes cal perform **data transformation** or **data validation**
- Pipes can return data - either original or modified - which will be passed on to the router handler
- Pipes can be asynchronous

### Default Pipes in NestJS
NestJS ships with useful pipes within the `@nestjs/common` module.

ValidationPipe:
> Validates the compatibility of an entire object against a class (goes well with DTOs, or Data Transfer Objects). If any property cannot be mapped properly (e.g. mismatching type) validation will fail.
> A very common use case, therefore having a built-in validation pipe is extremely useful

ParseIntPipe
>By default, arguments are of type String. This pipe validates that an argument is a number. If successful, the argument is transformed into a Number and passed on to the handler.

### Custom Pipe Implementation
- Pipes are classes annotated with the `@Injectable()` decorator
- Pipes must implement the **PipeTransform** generic interface. Therefore, every pipe must have a **transform()** method. This method will be called by NestJs to process the arguments.
- The **Transform()** method accepts two parameters:
	- **value**: the value of the processed argument
	- **metadata** (optional): an object containing metadata about the argument
- Whatever is returned from the **transform()** method will be passed on to the route handler. Exceptions will be sent back to the client.
- Pipes can be consumed in different ways.

### Handler-level pipes
are defined at the handler level, via the `@usePipes()` decorator. Such pipe will process all parameters for the incoming requests.

```ts
@Post()
@UsePipes(SomePipe)
createTask(
	@Body('description') description {
		// ...
	}
)
```

### Parameter-level pipes
are defined at the parameter level. Only the specific parameter for which the pipe has been specified will be processed.
```ts
@Post()
createTask(
@Body('description', SomePipe) description
 ){
	// ...	
}
```

### Global pipes
are defined at the application level and will be applied to any incoming request
```ts
async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	app.useGlobalPipes(SomePipe);
	await app.listen(3000);
}
bootstrap();
```



### Param-level VS Handler-level pipes
**Parameter-level pipes** tend to be slimmer and cleaner. however, they often result in extra code added to handlers - this can get messy and hard to maintain.

**Handler-level pipes** require some more code, but provide some great benefits:
- Such pipes do not require extra code at the parameter level
- Easier to maintain and expand. If the shape of the data changes, it is easy to make the necessary changes within the pipe only.
- Responsibility of identifying the arguments to process is shifted to one central file - the pipe file.
- Promote usage of DTOs (Data Transfer Objects) which is very good practice.



## Task Management Validation Pipes
Firstly we must add to the main file to use the Validation pipes in line 7.

![[Pasted image 20240522124109.png]]


Then we've downloaded the `common-validator` package:
```bash
npm install class-validator --save
```


### Validation - Non empty Body Task Create 
and then used as it please:
![[Pasted image 20240522124506.png]]
EXAMPLE:
![[Pasted image 20240522124456.png]]




### Validation - Task not found
![[Pasted image 20240522124901.png]]

RESULT:
![[Pasted image 20240522124911.png]]



### Validation - Delete non existing Task
Added to line just searching the getTaskById in order to check if id is valid
![[Pasted image 20240522125110.png]]


### Validation - Update status task
We've created an new dto in order to make the validation with IsEnum and passing the Enums available.

![[Pasted image 20240522125506.png]]

Then in the controller we've modified the param to be of his type `UpdateTaskStatusDto`
![[Pasted image 20240522125622.png]]

and grab the status from the variable.

RESULT:
![[Pasted image 20240522125749.png]]




### Validation - Optional task filters

![[Pasted image 20240522125919.png]]






# 3. Data Persistence - PostgreSQL and TypeORM
We've used postgres inside a docker container in order to create our DB. We've also used pgAdmin to handle SQL data&queries.

```bash
docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

Afterwards we've created a new database called task-management in the pgAdmin UI.

## Pros and Cons of using an ORM library

PROS:
- Writing the data model in one place - easier to maintain. Less repetition
- Lots of things done automatically - database handling, data types, relations etceterea
- No need to write SQL syntax (easy to learn, hard to master). Using your natural way of coding.
- Database abstraction - you can change the database type whenever you wish.
- Leverages OOP, therefore things like inheritance are easy to achieve
CONS:
- You have to learn it, and ORM libraries are not always simple
- Performance is alright, but it's easy to neglect
- Makes it easy to forget (or never learn) wht's happening behind the scenes, which you can lead to a varia of maintainability issues.

## TypeORM
TypeORM is an ORM library that can run in Node.js and be used with TypeScript (or JavaScript).
Help us define and manage entities, repositories, columns, relations, replication, indices, queries, logging and so much more.

e.g.:
Retrieving all tasks owned by "Ashley" and are of status "Done".

TYPEORM:
```ts
const task = await Task.find({ status: 'DONE', user: 'Ashley' })
```
PURE JS:
```js
let tasks;
db.query('SELECT * FROM tasks WHERE status = "DONE" AND user = "Ashley"', (err, result) => {
	if (err) {
		throw new Error('Could not retrieve tasks!');
	}
	tasks = result.rows;
});
```

Docs: [https://typeorm.io](TypeORM Documentation)

## Setting up DB Connection
Installing libraries:
```bash
yarn add typeorm @nestjs/typeorm pg
```

added to `app.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

  

@Module({
imports: [
	TasksModule,
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'task-management',
		autoLoadEntities: true,
		synchronize: true,
	}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
```

## Creating Task Entity
New file called `src/tasks/task.entity.ts`:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task.model';

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column()
	title: string;
	
	@Column()
	description: string;
	
	@Column()
	status: TaskStatus;
}
```

## Creating Task Repository

[Active Record vs Data Mapper](https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md)

We've created a new file called `src/tasks/tasks.repository.ts`:
```ts
import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {}
```

In order to make the dependency injection we've added to the `tasks.module.ts` the following:
```ts
@Module({
imports: [TypeOrmModule.forFeature([Task])],
controllers: [TasksController],
providers: [TasksService, TasksRepository],
})

export class TasksModule {}
```

## Refactor Task Services

In our `tasks.repository.ts` we have the new logic based on the constructor

![[Pasted image 20240714173126.png]]
![[Pasted image 20240714173407.png]]
Now in the `tasks.service.ts` we're calling the functions from the tasksRepository to access and filter
![[Pasted image 20240714173426.png]]

Lastly, in the `tasks.controller.ts` we can ask the tasksService to call the functions
![[Pasted image 20240714173444.png]]

## Relationship tables
Taking int account this two entities:

**Task**
```ts
@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column()
	title: string;
	
	@Column()
	description: string;
	
	@Column()
	status: TaskStatus;
}
```
**User**
```ts

@Entity()
export class User {
	@PrimaryGEneratedColumn('uuid')
	id: string;
   
   @Column({ unique: true })
   username: string;

	@Column()
	password: string;
}
```

In order to make a relationship between the User and Task tables we firstly take into account the priority order. It's going to be **1 User can have X many Tasks**. With that said, we can implement in this format:
**User**
```ts

@Entity()
export class User {
	@PrimaryGEneratedColumn('uuid')
	id: string;
   
   @Column({ unique: true })
   username: string;

	@Column()
	password: string;

	@OneToMany((_type) => Task, (task) => task.user, { eager: true})
	tasks: Task[];
}
```

**Task**
```ts
@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column()
	title: string;
	
	@Column()
	description: string;
	
	@Column()
	status: TaskStatus;

	@ManyToOne((_type) => User, (user) => uesr.tasks, { eager: false })
	user: User;
}
```

With this implementation we can see in the Postgres Admin:
![[Pasted image 20240710232411.png]]

And in the Tasks table there's a new column of the userId with the user:
![[Pasted image 20240710233145.png]]


# 4. Authentication

In order to authenticate we've created a new Module called auth by the nest CLI which pointed to the imports from the `app.module.ts`.
## Auth Credentials Dto
This is the Dto for the Auth module
![[Pasted image 20240714175222.png]]

## User Entity
We've created a new entity called user in order to store the user id, username, password and the tasks related to him.
![[Pasted image 20240714174012.png]]

## Users Repository
In order to access and manipulate the user authentication we've created the Users Repository in order to create an user
![[Pasted image 20240714174124.png]]


## JWT Strategy & Validator
We've created a `jwt.strategy.ts` file in order to validate the user. To facilitate the interaction with the payload there's also a new file called `jwt-payload.interface.ts` which contains:
```ts
export interface JwtPayload {
	username: string;
}
```

![[Pasted image 20240714174420.png]]


## Auth Service
This is the AuthService logic for signUp and signin a new user. It will use the bcrypt to cryptograph the user's password before saving into the database

![[Pasted image 20240714175012.png]]

## Auth Controller
The endpoints that we're exporting in here are the `/auth/signup` and `/auth/signin` which both requires the AuthCredentialsDto
![[Pasted image 20240714174502.png]]

Usage:
![[Pasted image 20240714174747.png]]


![[Pasted image 20240714174820.png]]

With that authenticated we can restrict the Tasks Services by requiring the accessToken to make the HTTP Request.

## Restricting Tasks Service Endpoints
In order to restrict the endpoints we're adding the `UseGuards()` and passing the `AuthGuard()` from the passport package. 

To facilitate the global usage, we've added to the class `TasksController`. Besides that for each endpoint we've added the `@GetUser() user: User` and passed for each TasksService function.

![[Pasted image 20240714180145.png]]

# 5. Logging

## Types of Logs

 - Log - General purpose logging of important information
 - Warning - Unhandled issue that is NOT fatal or destructive
 - Error - Unhandled issue that is fatal or destructive
 - Debug - Useful information that can help us debug the logic in case of an error/warning. Intended for developers.
 - Verbose - Information providing insights about the behavior of the application. Intended for operators (for example, support). Usually "too much information".

## Log Levels

You could define multiple log levels for different environments. For example:

|             | Log | Error | Warning | Debug | Verbose |
| ----------- | :-: | :---: | :-----: | :---: | :-----: |
| Development |  V  |   V   |    V    |   V   |    V    |
| Staging     |  V  |   V   |    V    |   X   |    X    |
| Production  |  V  |   V   |    X    |   X   |    X    |



# 6. Configuration Management


- Central way of defining values that are loaded **upon starting the application** (should not be changed during runtime)
- Configuration per environment - development, staging, production, etc
- Configuration can be defined in the code base. Useful if you work with multiple developers via version control
- Can be defined in may ways (JSON, YAML, XML, Environment Variables, etc), using custom solutions or open-source libraries

## Codebase VS Environment Variables
You could define configuration in your codebase. For example, in a **config** folder.

You could also support configuring values via **environment variables** (which are provided when running the application)

**Example**:
- Non-sensitive information such as the port to run the application on, will be defined in the code base.
- Sensitive information such as database username and password **for production mode**, will be provided via environment variables upon running the application


