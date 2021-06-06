import { RatePlanModule } from './rate-plan.module';

describe('RatePlanModule', () => {
  let ratePlanModule: RatePlanModule;

  beforeEach(() => {
    ratePlanModule = new RatePlanModule();
  });

  it('should create an instance', () => {
    expect(ratePlanModule).toBeTruthy();
  });
});
