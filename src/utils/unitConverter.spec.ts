import { isConvertible, unitConverter } from './unitConverter';

describe('Unit Converter', () => {
  describe('isConvertible', () => {
    it('should be able to convert similar types', () => {
      expect(isConvertible('CM', 'M')).toBe(true);
      expect(isConvertible('ML', 'L')).toBe(true);
      expect(isConvertible('G', 'KG')).toBe(true);
    });
    it('should not be able to convert different types', () => {
      expect(isConvertible('G', 'M')).toBe(false);
      expect(isConvertible('M', 'KG')).toBe(false);
      expect(isConvertible('CM', 'L')).toBe(false);
    });
  });
  describe('unitConverter', () => {
    it('shoiuld convert meters to centimeters and viceverca', () => {
      expect(unitConverter(100, 'CM', 'M')).toBe(1);
      expect(unitConverter(0.5, 'M', 'CM')).toBe(50);
    });
    it('shoiuld convert kilograms to grams and viceverca', () => {
      expect(unitConverter(150, 'G', 'KG')).toBe(0.15);
      expect(unitConverter(0.5, 'KG', 'G')).toBe(500);
    });
    it('shoiuld convert litres to mililitres and viceverca', () => {
      expect(unitConverter(500, 'ML', 'L')).toBe(0.5);
      expect(unitConverter(0.55, 'L', 'ML')).toBe(550);
    });
  });
});
