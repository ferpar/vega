type PositionsTableProps = {
    data?: { label: string; value: number, price?: number, quantity?: number }[];
    grouped?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const PositionsTable = ({data, grouped = false, ...delegated}: PositionsTableProps) => {
    if (!data) return null;
    return (
        <div {...delegated} style={{ border: '1px solid var(--text-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', fontWeight: 'bold', padding: '8px' }}>
                <div style={{ flex: 1 }}>Asset</div>
                { !grouped && <div style={{ flex: 1 }}>Quantity</div>}
                { !grouped && <div style={{ flex: 1 }}>Price</div> }
                <div style={{ flex: 1 }}>Value</div>
            </div>
            {data?.map((position, i) => (
                <div key={i} style={{ display: 'flex', padding: '8px', borderBottom: '1px solid var(--text-color)' }}>
                    <div style={{ flex: 1 }}>{position.label}</div>
                    { !grouped && <div style={{ flex: 1 }}>{position.quantity}</div>}
                    { !grouped && <div style={{ flex: 1 }}>{position.price}</div> }
                    <div style={{ flex: 1 }}>{position.value}</div>
                </div>
            ))}
        </div>
    );
}