import { Brackets, WhereExpressionBuilder } from 'typeorm';

export const searchNames = (builder: WhereExpressionBuilder, field: string, keyword: string) => {
  const keywords = keyword
    .trim()
    .split(' ')
    .filter(item => item.length);

  if (keywords.length === 2) {
    const [first, last] = keywords;
    builder.andWhere(
      new Brackets(qb => {
        qb.where(`${field} ilike :name1`, { name1: `%${first}%${last}%` });
        qb.orWhere(`${field} ilike :name2`, { name2: `%${last}%${first}%` });
      }),
    );
  } else if (keywords.length === 3) {
    const [first, middle, last] = keywords;
    builder.andWhere(
      new Brackets(qb => {
        qb.where(`${field} ilike :name1`, { name1: `%${first}%${middle}%${last}%` });
        qb.orWhere(`${field} ilike :name2`, { name2: `%${first}%${last}%${middle}%` });
        qb.orWhere(`${field} ilike :name3`, { name3: `%${middle}%${first}%${last}%` });
        qb.orWhere(`${field} ilike :name4`, { name4: `%${middle}%${last}%${first}%` });
        qb.orWhere(`${field} ilike :name5`, { name5: `%${last}%${first}%${middle}%` });
        qb.orWhere(`${field} ilike :name6`, { name6: `%${last}%${middle}%${first}%` });
      }),
    );
  } else {
    builder.andWhere(`${field} ilike :name`, { name: `%${keyword.trim()}%` });
  }
};
