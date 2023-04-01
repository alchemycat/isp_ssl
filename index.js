const { Ssl } = require("./modules/Ssl.js");
const { Random } = require("./modules/Random.js");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { random } = new Random();

const login = process.env.LOGIN;
const password = process.env.PASSWORD;
const ip = process.env.IP;
const port = process.env.PORT;

const listPath = path.resolve(__dirname, "list.txt");

let list = fs.readFileSync(listPath, { encoding: "utf-8" });

if (/\n/.test(list)) {
	list = list.split("\n");
} else {
	list = list.split("\r");
}

if (!list.length || !list[0])
	return console.log("В файле list.txt нету доменов");

async function main() {
	const ssl = new Ssl();

	const url = `https://${ip}:${port}/ispmgr?authinfo=${login}:${password}`;

	let response = await ssl.getSubdomains(url);

	if (!response) return console.log("axios error");

	let data = response.data.doc.elem;

	const subdomains = [];

	list.forEach((domain) => {
		data.forEach((item) => {
			const subdomain = item.name["$"];
			if (subdomain.includes(domain)) {
				subdomains.push(subdomain);
			}
		});
	});

	let counter = 0;

	if (!subdomains.length)
		return console.log(
			`Не удалось найти поддомены для доменов из вашего списка`,
		);

	while (counter < subdomains.length) {
		const target = subdomains[counter];

		let user = list.filter((item) => target.includes(item));

		if (!user.length)
			return console.log(`Не удалось найти пользователя для домена ${target}`);

		user = user[0];

		const currentURL = `https://${ip}:${port}/ispmgr?authinfo=${user}:${password}`;

		let result = null;
		let tryCounter = 0;

		while (!result && tryCounter < 5) {
			tryCounter++;
			console.log(`Попытка: ${tryCounter} для домена: ${target}`);
			result = await create(target, currentURL);
		}

		counter++;
	}

    console.log("Выполнение завершено");

	async function create(target, currentURL) {
		let name = random(3);

		console.log(`Создаю SSL для ${target}. Название: ${target}_${name}`);

		response = await ssl.create(currentURL, target, name);

		if (response.data.doc.error) {
			error = response.data.doc.error["$type"];

			if (error == "exists") {
				console.log(`SSL для домена ${target} уже существует`);
				return false;
			} else {
				console.log(`Ошибка при создании SSL для домена ${target}`);
				return false;
			}
		} else {
			console.log(`SSL создан для домена: ${target}`);
			return true;
		}
	}

	// data.doc.elem json path

	//data.doc.error["$type"] === exists
}

main();
