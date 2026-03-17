## java.time.Instant

- commonly used in Spring Boot applications, 
- used to represent a specific point in time, ==independent of any time zone==. 
- fundamental building block of the Java Date and Time API 

## Project Lombok

- an ==annotation-based Java library==. 
- automatically generates boilerplate like getters, setters, and constructors.  
- makes Java code more concise and readable. 
- some of the annotations
	- `@Getter`
	- `@Setter`
	- `@ToString`
	- `@EqualsAndHashCode`
	- `@NoArgsConstructor`
	- `@AllArgsConstructor`
	- `@Builder`
	- `@Value` (immutable class, final fields with getters)
	- `@Data` (combines first 5)
