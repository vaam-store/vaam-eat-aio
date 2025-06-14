type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  return (
    <div>
      <h1>Edit Product: {(await params).id}</h1>
      <p>Modify the details of your product listing {(await params).id}.</p>
      {/* TODO: Display form to edit an existing product */}
    </div>
  );
}
