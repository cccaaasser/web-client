import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import DocumentBadge from "components/documents/Badge";
import Loading from "components/ui/Loading";
import RelativeDateFormatter from "components/ui/RelativeDateFormatter";
import useFetch from "hooks/useFetch";

const RecentDocumentsWidget = () => {
    const [documents] = useFetch(`/documents?limit=5`)

    if (!documents) return <Loading />

    return <article className="card">
        <h4>Recent documents</h4>

        {documents.length === 0 ?
            <p>No documents to show.</p>
            :
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Created</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {documents.map(doc => <Tr key={doc.id}>
                        <Td><DocumentBadge key={doc.id} document={doc} /></Td>
                        <Td><RelativeDateFormatter date={doc.insert_ts} /></Td>
                    </Tr>)}
                </Tbody>
            </Table>
        }
    </article>
}

export default RecentDocumentsWidget;
