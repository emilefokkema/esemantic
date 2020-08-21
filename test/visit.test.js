import {visit} from '../src/visit';
import visitorCases from './visitor-cases';

describe.each(visitorCases.map(c => [c.script]))('when visiting', (script) => {
	
	describe(`the tree for script '${script}'`, () => {

		it('should', () => {
			expect(true).toBe(true);
		});
	});
});