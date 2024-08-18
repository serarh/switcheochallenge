/*
1. inefficient state updates : 'useEffect' hook only runs once but doesn;r handle state updates efficiently or account for future changes in the 'DataSource' URL
    improvement : use 'async', handles potential errors and possibly move the data-fetching logic to a custom hook making it cleaner.
2. redundant computations : 'getPriority' is called alot within 'useMemo' hook
    improvement : refactor 'getPriority'
3.inefficient sorting : sorting happens every render
    improvement : use 'useMemo' to make sure sorting is only recalculated when dependencies change
4. state initialization : 'price' initialized as an empty object, can cause issues when accessing properties
    improvement : define a type for 'prices;
5. missing dependencies in 'useEffect' :'useEffect' depends on 'DataSource', but is not listed as a dependency, is 'Datasource' changes, effect wont rerun
    improvement : ensure all dependencies are correctly listed
6. formatting issues : 'formatted' in 'formattedBalances' uses 'toFixed()' without specifying number of decimals
    improvement : specify number of decimals
7. potential key prop warning : 'index' as a key in 'rows' mapping could lead to issues if items in list change
    improvement : use a unique identifier for key prop if available
*/


interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Prices {
    [currency: string]: number;
}

class Datasource {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async getPrices(): Promise<Prices> {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error('Failed to fetch prices');
        return response.json();
    }
}

interface Props extends BoxProps { }

const WalletPage: React.FC<Props> = (props: Props) => {
    const {children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState<Prices>({});

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const datasource = new Datasource("https://interview.switcheo.com/prices.json");
                const prices = await datasource.getPrices();
                setPrices(prices);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPrices();
    }, []);

    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
            case 'Osmosis': return 100;
            case 'Ethereum': return 50;
            case 'Arbitrum': return 30;
            case 'Zilliqa': return 20;
            case 'Neo': return 20;
            default: return -99;
        }
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter(balance => balance.amount > 0)
            .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
    }, [balances]);

    const formattedBalances = useMemo(() =>
        sortedBalances.map(balance => ({
            ...balance,
            formatted: balance.amount.toFixed(2)
        }))
        , [sortedBalances]);

    const rows = useMemo(() =>
        formattedBalances.map((balance, index) => {
            const usdValue = (prices[balance.currency] || 0) * balance.amount;
            return (
                <WalletRow 
          className= { classes.row }
            key = { balance.currency + balance.amount }  // Assuming currency + amount is unique
            amount = { balance.amount }
            usdValue = { usdValue }
            formattedAmount = { balance.formatted }
                />
      );
})
  , [formattedBalances, prices]);

return (
    <div { ...rest } >
    { rows }
    < /div>
);
};
