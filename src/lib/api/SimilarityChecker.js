/* 
SimilarityChecker 
: Input : 2 responses
: Output : 1 Json object
: Level-1 solution
	a. If the output is radio, then - selected option must match
	b. If the output is checkbox, then - any 1 option can match
	c. If the output is text, then - entered text must match (in lowercase)
: Level-2 solution
	a. If the output is radio, then - selected option must match
	b. If the output is checkbox, then - selected options must match exactly
	c. If the output is text, then - entered text must match (in lowercase)
: Level-3 solution
	a. If the output is radio, then - selected option must match
	b. If the output is checkbox, then - selected options must match exactly
	c. If the output is text, then - context must match
*/

export const SimilarityChecker = (input=[]) => {
	let res1 = input[0] && input[0].response;
	let res2 = input[1] && input[1].response;
	let common = [];
	let description = "";

	for (let i in res1) {
		if (typeof(res1[i]) === "string") {
			if (res1[i] === res2[i]) {
				common.push({"key": [i-1], "value": res1[i]});
			}
		} else if (typeof(res1[i]) === "object") {
			// let atleastOne = false;
			let res1i = [];
			let res2i = [];
			for (let val in res1[i]) {
				res1i.push(res1[i][val]);
			}
			for (let val in res2[i]) {
				// res2i.push(res2[i][j]);
				let com = res1i.find(ans => ans === res2[i][val]);
				if (!!com) res2i.push(com);
			}
			if (res2i[0]) {
				res2i = res2i.sort().toString().replace(/,/g, ", ");
				description += res2i + ", ";
				common.push({"key": i, "value": res2i});
			}
		}
	}
	return {common, description};
}