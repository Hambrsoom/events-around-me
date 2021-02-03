
import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { Todo, TodoInput } from '../entities/Todo'
import { checkJwt } from '../middlewares/checkJwt'

@Resolver((of) => Todo)
export class TodoResolver {
  private todos: Todo[] = []

  @Query(() => [Todo], { nullable: true })
  @UseMiddleware(checkJwt)
  async getTodos(): Promise<Todo[]> {
    return await this.todos
  }

  @Mutation((returns) => Todo)
  async addTodo(
    @Arg('todoInput') { title, description }: TodoInput
  ): Promise<Todo> {
    const todo = {
      id: Math.random(), // not really unique
      title,
      description,
      status: false,
    }

    await this.todos.push(todo)
    return todo
  }
}