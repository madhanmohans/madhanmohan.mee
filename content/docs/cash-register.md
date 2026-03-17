Not cheap and fast
What if printer is broken, the CashRegister will fail in production
Spy?
verify(mockPrinter).printer(”purchased item”);
  
Mock is a fake object which has the same contract as the dependency
Mock Printer is spying on the dependency for testing
Cash Register → Purchase → Item
Cash Register (transitive dependency) Item
items.stream().map(Objects::toString).collect(Collectors.joining(”, ”));
when(stubbedPurchase.asString()).thenReturn(”stubbed items”) → overriding of the method
mock → used to assert the behaviour of the dependency
stub → used to return dummy values for testing
mock api, database, server, network call
Mock will spy method call, arguments and how many times the method has been called
Mock won’t spy on the private methods, because it only fakes the contract which is exposed
Hierarchy or tools to know what is dependant on what
We cannot mock constants