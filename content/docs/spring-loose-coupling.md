[https://dev.to/souvikdas/spring-loose-coupling-basic-terminlogies-2cpe](https://dev.to/souvikdas/spring-loose-coupling-basic-terminlogies-2cpe)

> [!important]  
> This giving of control to spring to manage classes and objects in called Inversion of Control.@Component: Hey spring, this is a component and you need to manage its lifecycle.@Autowired: Hey spring, there is already a component of this type, so go and find it. Once you find it, autowire it to the current object. Now, we can tell spring to manage a component lifecycle using @Component and allow Spring to identify and create an object of a component using @Autowired.This Application Context represents the IoC Container in Spring. IoC Container stores and manages the instances of the classes and the instances created are called Beans.  
  
## Introduction to Spring Boot
- Spring Boot is built on top of Spring Framework