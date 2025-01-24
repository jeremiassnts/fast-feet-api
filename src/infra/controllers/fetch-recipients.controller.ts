import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { FetchRecipientUseCase } from 'src/domain/use-cases/fetch-recipients';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { RecipientPresenter } from '../presenters/recipient-presenter';

const fetchTransportersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  top: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});
type FetchTransportersQuerySchema = z.infer<
  typeof fetchTransportersQuerySchema
>;
const fetchTransportersValidationPipe = new ZodValidationPipe(
  fetchTransportersQuerySchema,
);

@Controller('/recipient')
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientUseCase) {}
  @Get()
  async handler(
    @Query(fetchTransportersValidationPipe) query: FetchTransportersQuerySchema,
  ) {
    const { page, top } = query;
    try {
      const { recipients } = await this.fetchRecipients.execute({
        page,
        top,
      });
      return { recipients: recipients.map(RecipientPresenter.toHTTP) };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
