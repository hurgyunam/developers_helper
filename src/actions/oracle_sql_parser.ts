type OracleParsedQueryType = "SELECT" | "INSERT" | "UPDATE" | "DELETE";
const oracleParsedQueryTypes: OracleParsedQueryType[] = ["SELECT", "INSERT", "UPDATE", "DELETE"];

export class OracleSqlParser {
    readonly queries: OracleParsedQuery[];
    constructor(sql: string) {
        this.queries = sql.split(';')
            .filter(query => query !== '')
            .map(query => new OracleParsedQuery(query));
    }
}

export class OracleParsedQuery {
    readonly type: OracleParsedQueryType;
    readonly tableName: string;
    readonly type2?: OracleParsedQueryType;
    readonly tableName2?: string;
    
    constructor(query: string) {
        const trimQuery = query.replaceAll("\n", " ");

        const optType = this.getType(query);

        if(optType) {
            this.type = optType;
        } else {
            throw `존재하지 않는 타입 ${query}`;
        }

        this.tableName = this.getTableName(this.type, trimQuery);

        const remainQuery = trimQuery.substring(trimQuery.indexOf(this.tableName) + this.tableName.length);

        this.type2 = this.getType(remainQuery);

        if(this.type2) {
            this.tableName2 = this.getTableName(this.type2, remainQuery);
        }
    }

    private getType(query: string): OracleParsedQueryType | undefined {
        const types = oracleParsedQueryTypes;
        const indexMap = new Map<number, OracleParsedQueryType>()

        for(const type of types) {
            indexMap.set(query.indexOf(type), type)
        }

        const indexes = types.map(type => {
            return query.indexOf(type)
        }).filter(index => index >= 0)
        const minIndex = Math.min(...indexes)

        return indexMap.get(minIndex);
    }

    // private getVariables(query: string): string[] {
    //     if(query.startsWith("SELECT")) {

    //     }
    // }

    private getTableName(type: OracleParsedQueryType, query: string): string {
        switch(type) {
            case "SELECT":
            case "DELETE":
                const fromIndex = query.indexOf("FROM") + "FROM".length
                const whereIndex = query.indexOf("WHERE")

                return query.substring(fromIndex, whereIndex)
            case "INSERT":
                const intoIndex = query.indexOf("INTO") + "INTO".length
                const columnIndex = query.indexOf("(")

                return query.substring(intoIndex, columnIndex)
            case "UPDATE":
                const updateIndex = query.indexOf("UPDATE") + "UPDATE".length
                const setIndex = query.indexOf("SET")

                return query.substring(updateIndex, setIndex)
            default:
                return query;
        }
    }

    public toObj() {
        return {
            type: this.type,
        }
    }

    public key(): string {
        return `${this.type} `
    }
}