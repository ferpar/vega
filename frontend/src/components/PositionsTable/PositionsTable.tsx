type PositionsTableProps = {
    data?: { label: string; value: number, price?: number, quantity?: number }[];
    grouped?: boolean;
} & React.HTMLAttributes<HTMLTableElement>;

export const PositionsTable = ({data, grouped = false, ...delegated}: PositionsTableProps) => {
    if (!data) return null;
    return (
        <table {...delegated}>
            <thead>
                <tr>
                    <th>Asset</th>
                    { !grouped && <th>Quantity</th>}
                    { !grouped && <th>Price</th> }
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((position, i) => (
                    <tr key={i}>
                        <td>{position.label}</td>
                        { !grouped && <td>{position.quantity}</td>}
                        { !grouped && <td>{position.price}</td> }
                        <td>{position.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}