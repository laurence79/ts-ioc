import Container from '../Container';
import createContainer from '../createContainer';
import injectable from '../decorators/injectable';

it('returns registered instances', () => {
  class A {}

  const container = createContainer();
  const instance = new A();

  container.registerSingleton(A, instance);

  const resolved = container.resolve(A);

  expect(instance).toBe(resolved);
});

it('constructs unregistered types if they have no params', () => {
  class A {}

  const container = createContainer();

  const instance = container.resolve(A);

  expect(instance).toBeInstanceOf(A);
});

it('creates instances with dependencies', () => {
  class B {}

  @injectable()
  class A {
    constructor(public b: B) {}
  }

  const container = createContainer();

  const instance = container.resolve(A);

  expect(instance).toBeInstanceOf(A);
  expect(instance.b).toBeInstanceOf(B);
});

it('throws an error if unregistered type has params', () => {
  class A {
    constructor(public b: string) {}
  }

  const container = createContainer();

  expect(() => container.resolve(A)).toThrow('Unable to construct "A"');
});

it('uses registered instances when resolving dependencies', () => {
  class B {}

  @injectable()
  class A {
    constructor(public b: B) {}
  }

  const container = createContainer();
  const instance = new B();
  container.registerSingleton(B, instance);

  expect(container.resolve(A).b).toBe(instance);
});

it('handles registering an extended type to be resolved in place of a superclass', () => {
  class A {}
  class B extends A {}

  const container = createContainer();
  container.registerAlias(A, B);

  const instance = container.resolve(A);
  expect(instance).toBeInstanceOf(B);
});

it('handles registering an extended type to be resolved in place of a abstract base class', () => {
  abstract class A {}
  class B extends A {}

  const container = createContainer();
  container.registerAlias(A, B);

  const instance = container.resolve(A);
  expect(instance).toBeInstanceOf(B);
});

it('can inject the container', () => {
  @injectable()
  class A {
    constructor(public container: Container) {}
  }

  const container = createContainer();
  const instance = container.resolve(A);

  expect(instance.container).toBe(container);
});
