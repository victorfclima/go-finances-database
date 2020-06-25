// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Categories from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionRepository.save(transaction);

    // const { total } = await account.getBalance();
    // if (type === 'outcome' && total < value) {
    //   throw new Error('You do not have enough balance');
    // }

    return transaction;
  }
}

export default CreateTransactionService;
