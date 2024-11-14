"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

interface FeeItem {
  id: string
  name: string
  amount: number
  description: string
  mandatory: boolean
}

export default function PaymentsPage() {
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<string>('')

  // Example fee items - replace with actual data from your backend
  const feeItems: FeeItem[] = [
    {
      id: 'room',
      name: 'Room Rent',
      amount: 15000,
      description: 'Monthly room rent for double occupancy',
      mandatory: true
    },
    {
      id: 'utilities',
      name: 'Utilities',
      amount: 2000,
      description: 'Electricity, water, and internet charges',
      mandatory: true
    },
    {
      id: 'maintenance',
      name: 'Maintenance Fee',
      amount: 1000,
      description: 'Monthly maintenance and cleaning services',
      mandatory: true
    },
    {
      id: 'meal',
      name: 'Meal Plan',
      amount: 3500,
      description: 'Optional meal plan (3 meals per day)',
      mandatory: false
    },
    {
      id: 'laundry',
      name: 'Laundry Service',
      amount: 800,
      description: 'Optional weekly laundry service',
      mandatory: false
    }
  ]

  useEffect(() => {
    // Initially select all mandatory fees
    setSelectedFees(feeItems.filter(item => item.mandatory).map(item => item.id))
  }, [])

  useEffect(() => {
    // Calculate total whenever selected fees change
    const newTotal = feeItems
      .filter(item => selectedFees.includes(item.id))
      .reduce((sum, item) => sum + item.amount, 0)
    setTotal(newTotal)
  }, [selectedFees])

  const toggleFee = (feeId: string) => {
    const fee = feeItems.find(item => item.id === feeId)
    if (fee?.mandatory) return // Can't toggle mandatory fees

    setSelectedFees(prev => 
      prev.includes(feeId) 
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    )
  }

  const handlePayment = () => {
    setShowPaymentModal(true)
    setPaymentStep(1)
  }

  const closeModal = () => {
    setShowPaymentModal(false)
    setPaymentStep(1)
    setSelectedMethod('')
  }

  return (
    <div className="min-h-screen bg-background text-white font-clash">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/student/dashboard">
          <Button variant="ghost" className="text-white hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary-dark/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8 text-primary">
              Hostel Fees
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transparent breakdown of all hostel fees and charges
            </p>
          </div>
        </div>
      </section>

      {/* Fee Calculator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Fee Items */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary mb-6">Fee Components</h2>
              {feeItems.map((fee) => (
                <div
                  key={fee.id}
                  className={`backdrop-blur-md p-6 rounded-xl shadow-lg border transition-all cursor-pointer
                    ${selectedFees.includes(fee.id) 
                      ? 'bg-primary/20 border-primary' 
                      : 'bg-white/10 border-white/20 hover:border-primary/50'
                    }
                    ${fee.mandatory ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => toggleFee(fee.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">
                      {fee.name}
                      {fee.mandatory && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Mandatory
                        </span>
                      )}
                    </h3>
                    <span className="text-xl font-bold">₹{fee.amount}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{fee.description}</p>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 h-fit sticky top-4">
              <h2 className="text-2xl font-bold text-primary mb-6">Bill Summary</h2>
              
              {/* Selected Items */}
              <div className="space-y-3 mb-6">
                {selectedFees.map(feeId => {
                  const fee = feeItems.find(item => item.id === feeId)
                  return (
                    <div key={feeId} className="flex justify-between">
                      <span className="text-gray-300">{fee?.name}</span>
                      <span className="font-medium">₹{fee?.amount}</span>
                    </div>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 my-4"></div>

              {/* Total */}
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total Amount</span>
                <span className="text-primary">₹{total}</span>
              </div>

              {/* Payment Details */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Payment is processed securely</li>
                  <li>• Multiple payment methods available</li>
                  <li>• Receipt will be emailed after payment</li>
                  <li>• Contact admin for payment issues</li>
                </ul>
              </div>

              {/* Pay Button */}
              <Button 
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary/90 text-black font-medium text-lg py-6"
              >
                Pay ₹{total}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">When is the payment due?</h3>
              <p className="text-gray-300">Payments are due by the 5th of each month. Late payments may incur additional charges.</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">What payment methods are accepted?</h3>
              <p className="text-gray-300">We accept credit/debit cards, UPI, net banking, and other popular payment methods.</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-gray-300">Refund policies vary based on the fee type. Contact the admin for specific cases.</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">How often do fees change?</h3>
              <p className="text-gray-300">Fee revisions, if any, are communicated at least 3 months in advance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Student Hostel Management. All rights reserved.
          </p>
        </div>
      </footer>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-white/20 rounded-xl w-full max-w-lg mx-4 relative">
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-primary">Payment Gateway</h2>
              <p className="text-sm text-gray-400 mt-1">Secure payment processing</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium mb-4">Select Payment Method</h3>
                  
                  {/* UPI Option */}
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod === 'upi' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/10 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod('upi')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-full">
                        <img src="/upi-icon.png" alt="UPI" className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">UPI Payment</h4>
                        <p className="text-sm text-gray-400">Pay using any UPI app</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Option */}
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod === 'card' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/10 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod('card')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-full">
                        <img src="/card-icon.png" alt="Card" className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Card Payment</h4>
                        <p className="text-sm text-gray-400">Credit or Debit Card</p>
                      </div>
                    </div>
                  </div>

                  {/* Net Banking Option */}
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod === 'netbanking' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/10 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod('netbanking')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-full">
                        <img src="/bank-icon.png" alt="Net Banking" className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Net Banking</h4>
                        <p className="text-sm text-gray-400">All major banks supported</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === 2 && (
                <div className="space-y-4">
                  {selectedMethod === 'upi' && (
                    <>
                      <div className="text-center">
                        <div className="bg-white/10 p-6 rounded-lg inline-block mb-4">
                          <img src="/qr-code.png" alt="QR Code" className="h-48 w-48" />
                        </div>
                        <p className="text-sm text-gray-400 mb-2">Scan QR code using any UPI app</p>
                        <p className="text-primary font-medium">UPI ID: hostel@upi</p>
                      </div>
                    </>
                  )}

                  {selectedMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Card Number</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Expiry Date</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">CVV</label>
                          <input 
                            type="password" 
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                          <div 
                            key={bank}
                            className="p-4 rounded-lg border border-white/10 hover:border-primary/50 cursor-pointer text-center"
                          >
                            <img src={`/${bank.toLowerCase()}-logo.png`} alt={bank} className="h-8 mx-auto mb-2" />
                            <p className="text-sm">{bank} Bank</p>
                          </div>
                        ))}
                      </div>
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary">
                        <option value="">Other Banks</option>
                        {/* Add more bank options */}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Amount Summary */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              {paymentStep === 1 ? (
                <Button
                  onClick={() => setPaymentStep(2)}
                  disabled={!selectedMethod}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-medium py-6 disabled:opacity-50"
                >
                  Continue
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={() => setPaymentStep(1)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-6"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      // Implement actual payment processing
                      console.log('Processing payment...')
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-black font-medium py-6"
                  >
                    Pay ₹{total}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
