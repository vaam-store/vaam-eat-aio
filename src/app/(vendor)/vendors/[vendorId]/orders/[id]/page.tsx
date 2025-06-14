type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Order Details: {id}</h1>
      <p>Detailed information for order {id}.</p>
      {/* TODO: Display order details, tracking info, support options */}
    </div>
  );
}
