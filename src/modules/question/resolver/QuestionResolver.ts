import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { QuestionRepository } from "../QuestionRepository";
import { QuestionFilterType, Question, NewQuestionInput, Questions } from "../entities/Question";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => Question)
export class QuestionResolver {
  constructor(@InjectRepository(Question) private readonly questionRepository: QuestionRepository) {}

  @Authorized()
  @Query(_type => Question)
  public async question(@Arg('id') id: string): Promise<Question | undefined> {
    return await this.questionRepository.findOne(id);
  }

  @Authorized()
  @Query(_type => Questions)
  public async questions(@Arg('questionFilterType') data: QuestionFilterType): Promise<Questions> {
      return await this.questionRepository.getQuestions(data);
  }

  @Authorized()
  @Mutation(_returns => Question)
  public async createQuestion(@Arg('data') data: NewQuestionInput): Promise<Question | undefined> {
    return this.questionRepository.createQuestion(data);
  }

  @Authorized()
  @Mutation(_returns => Question)
  public async updateQuestion(@Arg('data') data: NewQuestionInput): Promise<Question | undefined> {
    return this.questionRepository.updateQuestion(data);
  }

  @Authorized()
  @Mutation(_returns => String)
  public async removeQuestion(@Arg('id') id: string): Promise<string> {
    await this.questionRepository.removeQuestion(id);
    return id;
  }
}