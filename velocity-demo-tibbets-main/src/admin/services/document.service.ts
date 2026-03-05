
export interface Document {
    id: string;
    name: string;
    type: string; // 'pdf', 'image', 'spreadsheet', etc.
    size: string; // e.g. '2.4 MB'
    customerName: string;
    accountNumber: string;
    dateUploaded: string; // ISO date string or formatted string
    uploadedBy: string;
    uploadedByAvatar?: string; // Optional URL for avatar
    thumbnailUrl?: string; // Optional thumbnail for images
}

export class DocumentService {
    private static documents: Document[] = [
        {
            id: '1',
            name: 'Lien_Waiver_Project_Alpha.pdf',
            type: 'pdf',
            size: '1.2 MB',
            customerName: 'BuildRight Construction',
            accountNumber: '#3344',
            dateUploaded: '2023-10-24',
            uploadedBy: 'Admin User',
        },
        {
            id: '2',
            name: 'Job_Site_Photos_Framing.jpg',
            type: 'image',
            size: '3.5 MB',
            customerName: 'BuildRight Construction',
            accountNumber: '#3344',
            dateUploaded: '2023-10-22',
            uploadedBy: 'Mike Wong',
        },
        {
            id: '3',
            name: 'Signed_Contract_2024_Builds.pdf',
            type: 'pdf',
            size: '4.1 MB',
            customerName: 'Elite Homes Inc',
            accountNumber: '#9012',
            dateUploaded: '2023-10-20',
            uploadedBy: 'Admin User',
        },
        {
            id: '4',
            name: 'Material_Takeoff_Q4.xlsx',
            type: 'spreadsheet',
            size: '850 KB',
            customerName: 'Elite Homes Inc',
            accountNumber: '#9012',
            dateUploaded: '2023-10-18',
            uploadedBy: 'System Auto',
        },
        {
            id: '5',
            name: 'Lien_Release_Final.pdf',
            type: 'pdf',
            size: '0.5 MB',
            customerName: 'Sarah Smith',
            accountNumber: '#5678',
            dateUploaded: '2023-10-15',
            uploadedBy: 'Admin User',
        },
        {
            id: '6',
            name: 'Site_Plan_Revision_3.pdf',
            type: 'pdf',
            size: '5.6 MB',
            customerName: 'BuildRight Construction',
            accountNumber: '#3344',
            dateUploaded: '2023-10-10',
            uploadedBy: 'John Architect',
        },
        {
            id: '7',
            name: 'Lumber_Order_Manifest_Oct.csv',
            type: 'spreadsheet',
            size: '120 KB',
            customerName: 'BuildRight Construction',
            accountNumber: '#3344',
            dateUploaded: '2023-10-09',
            uploadedBy: 'Admin User',
        },
        {
            id: '8',
            name: 'Permit_Application_Lot_54.pdf',
            type: 'pdf',
            size: '2.1 MB',
            customerName: 'Elite Homes Inc',
            accountNumber: '#9012',
            dateUploaded: '2023-10-05',
            uploadedBy: 'Admin User',
        },
        {
            id: '9',
            name: 'Warranty_Deed_Copy.pdf',
            type: 'pdf',
            size: '1.8 MB',
            customerName: 'John Doe',
            accountNumber: '#1234',
            dateUploaded: '2023-10-01',
            uploadedBy: 'Admin User',
        }
    ];

    static async getDocuments(): Promise<Document[]> {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.documents]);
            }, 500);
        });
    }

    static async searchDocuments(query: string): Promise<Document[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lowerQuery = query.toLowerCase();
                const filtered = this.documents.filter(doc =>
                    doc.name.toLowerCase().includes(lowerQuery) ||
                    doc.customerName.toLowerCase().includes(lowerQuery) ||
                    doc.accountNumber.toLowerCase().includes(lowerQuery)
                );
                resolve(filtered);
            }, 300);
        });
    }
}
