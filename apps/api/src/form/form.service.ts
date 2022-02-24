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
    const formData: FormEntity = this.formRepository.create({
      ...formPayload,
    });
    return await this.formRepository.save(formData);
  }
}
