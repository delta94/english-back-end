import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { QuestionRepository } from "../QuestionRepository";
import { QuestionFilterType, Question, NewQuestionInput } from "../entities/Question";
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
  @Query(_type => [Question])
  public async questions(@Arg('questionFilterType') data: QuestionFilterType): Promise<Question[] | undefined> {
      return await this.questionRepository.find({
        where: data,
        order: {
          updatedAt: 'DESC',
        }
      });
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
}