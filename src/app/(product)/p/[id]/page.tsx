type ProductPagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPagePageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Product: {id}</h1>
    </div>
  );
}
