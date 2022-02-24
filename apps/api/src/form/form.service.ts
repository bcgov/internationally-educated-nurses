import { FormDTO } from '@ien/common/src/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormEntity } from './entities/form.entity';
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private readonly formRepository: Repository<FormEntity>,
  ) {}
  async saveForm(formPayload: FormDTO) {
    const formDate: FormEntity = this.formRepository.create({
      ...formPayload,
    });
    await this.formRepository.save(formDate);
  }
}
