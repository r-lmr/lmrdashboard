export default function userHash(str: string): number {
	let hash: number = 0;
	let i: number;
	let char: number;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i)
		hash = ((hash<<5)-hash)+char
		hash = hash & hash 
	}
	return hash;
};

