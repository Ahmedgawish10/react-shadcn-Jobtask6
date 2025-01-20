import react, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/shadcnComp/ui/table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { jsPDF } from "jspdf";

const Transactions = () => {
  const [dataTransactions, setDataTransactions] = useState([]);
 // fetch the data from json used(jsonplachoder)
  useEffect(() => {
    fetch("http://localhost:3001/transactions")
      .then((response) => response.json())
      .then((data) => setDataTransactions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Pagination transaction page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  //total number of pages
  const totalPages = Math.ceil(dataTransactions?.length / itemsPerPage);//(50/10) 5  we have 5 pages each page have 10 transactions
  // calculate transactions for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = dataTransactions.slice(startIndex, endIndex);

  // handle Previous button click in table
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // handle Next button click in table
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // func to handle model of element row (vewi - edit - delete)
  const [selectedRow, setSelectedRow] = useState(null);
  const handleModel = (id) => {
    if (selectedRow === id) {
      setSelectedRow(null); 
    } else {
      setSelectedRow(id); 
    }
  };
  // download transaction operation 
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // title of transaction in pdf for clearfiy
    doc.text(`Transactions Data ${startIndex }page `, 10, 10);
  
    // style of each row in pdf transaction
    let spaceY = 20; 
    currentTransactions.forEach((transaction, index) => {
      doc.text(`Transaction ${index + 1}:`, 10, spaceY);
      spaceY+= 10;
      doc.text(`Card Number: ${transaction.cardNumber}`, 10, spaceY);
      spaceY+= 10;
      doc.text(`Status: ${transaction.status}`, 10, spaceY);
      spaceY+= 10;
      doc.text(`Cardholder: ${transaction.cardholder}`, 10, spaceY);
      spaceY+= 10;
      doc.text(`Expiration Date: ${transaction.expirationDate}`, 10, spaceY);
      spaceY+= 10;
      doc.text(`Created: ${transaction.created}`, 10, spaceY);
      spaceY+= 20; 
  
      // Add a new page if the content exceeds the page height
      if (spaceY > 280) {
        doc.addPage();
        spaceY = 20;
      }
    });
  
    // save transaction pdf
    doc.save(`Transactions.pdf`);
  };
  return (
    <div className="all-transaction  p-4 container mx-auto">
      <div className="flex justify-between flex-col sm:flex-row mb-4 ">
        <div className="box1 flex gap-2">
          <h1 className="text-xl font-bold py-2   ">Transactions</h1>
          <button className="  px-4 py-2 rounded text-gray-500">Issued cards</button>
        </div>
        <div className="box2 flex gap-2 self-end sm:self-auto order-[-5] sm:order-[5]">
          <button className="border-2 border-solid border-black px-4 py-2 rounded mr-2 hover:bg-black hover:text-white duration-500" onClick={handleDownload}>Download</button>
          <button className="border-2 border-solid border-black px-4 py-2 rounded mr-2 hover:bg-black hover:text-white duration-500">Filter</button>
        </div>

      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cardholder</TableHead>
            <TableHead>Expiration date</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-end">
                  <span className="bg-black text-white py-1 px-2 font-medium rounded me-2">Visa</span>
                  <span className="stars flex">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <span key={idx} className="flex items-center">*</span>
                    ))}
                  </span>
                  {transaction.cardNumber}
                </TableCell>
                <TableCell>
                  <span className="border-2 border-solid border-black py-1 px-4">{transaction.status}</span>
                </TableCell>
                <TableCell>{transaction.cardholder}</TableCell>
                <TableCell>{transaction.expirationDate}</TableCell>
                <TableCell className="relative">
                  {transaction.created}
                  <div onClick={() => handleModel(transaction.id)}
                    className="absolute right-[5px] top-[50%] transform  translate-x-[50%] sm:translate-x-[7%]  translate-y-[-50%] cursor-pointer text-xl" >
                    <div className="dots relative">
                      <BsThreeDotsVertical />
                      {selectedRow === transaction.id && (
                        <div className={`modal absolute ${transaction.id <= 4 ? " top-[-200%] left-[-900%]" : "top-[-1200%] left-[-900%]"} bg-black p-4 rounded`}>
                          <div className="modal-content w-[150px]">
                            <p className="text-white flex items-center"> Transaction<span className="text-[10px]"> : {transaction.cardNumber}</span> </p>
                            <p className="text-white hover:bg-gray-500 p-2 rounded transition duration-300 ease-in-out">
                              <a href="#">View</a>
                            </p>
                            <p className="text-white hover:bg-gray-500 p-2 rounded transition duration-300 ease-in-out">
                              <a href="#">Edit</a>
                            </p>
                            <p className="text-white hover:bg-gray-500 p-2 rounded transition duration-300 ease-in-out">
                              <a href="#">Delete</a>
                            </p>

                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-[350px]">
              <TableCell colSpan="5" className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* footer */}
      <div className="flex justify-between items-center flex-col sm:flex-row mt-4">
        <span className="font-medium">
          Viewing  {startIndex + 1}-{Math.min(endIndex, dataTransactions.length)} of {dataTransactions.length} results
        </span>
        <div>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="border-2 border-solid border-black px-4 py-2 rounded mr-2 disabled:opacity-50 hover:bg-black hover:text-white duration-500"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="border-2 border-solid border-black px-4 py-2 rounded mr-2 disabled:opacity-50 hover:bg-black hover:text-white duration-500"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default Transactions;