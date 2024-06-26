import { UsersNotFound } from '@/domain/user/use-cases/error-messages/user-not-found-error-message';
import { ListUserByIdUseCase } from '@/domain/user/use-cases/list-users-by-id-use-case';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { UserPresenter } from '../presenter/user-data-presenter';
import { ZodPipeValidator } from '@/infra/utils/pipes/zod-pipe-validator';

const listUserByIdParamSchema = z.object({
  id: z.string().uuid() || z.string().cuid(),
});

type ListUserByIdParamSchema = z.infer<typeof listUserByIdParamSchema>;

@Controller('users')
@UsePipes(new ZodPipeValidator(listUserByIdParamSchema))
export class ListUserByIdController {
  constructor(private readonly listUserByIdUseCase: ListUserByIdUseCase) {}

  @Get('list-by-id/:id')
  async handle(@Param() params: ListUserByIdParamSchema) {
    const { id } = params;

    const result = await this.listUserByIdUseCase.execute(id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UsersNotFound:
          return new NotFoundException(error);
        default:
          return new BadRequestException(error.message);
      }
    }

    const user = result.value.user;

    return { user: UserPresenter.toHttp(user) };
  }
}
