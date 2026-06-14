import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';

describe('CoffeeServiceService', () => {
  let service: CoffeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeeService],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
