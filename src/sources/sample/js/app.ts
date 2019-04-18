/**
 * TypeScript
 */

interface CanPrintInterface {
    print;
}

class TypeScriptTester implements CanPrintInterface {
    name;

    constructor(name: String) {
        this.name = name;
    }

    print() {
        console.log.apply(this, [
            "TypeScript: %c" + this.name + "!",
            "color: green;"
        ]);
    }
}

(new TypeScriptTester("nominal")).print();