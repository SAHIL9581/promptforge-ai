export default function Spinner({ size = 18 }) {
        return (
                <div
                        className="border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                        style={{ width: size, height: size }}
                />
        );
}
