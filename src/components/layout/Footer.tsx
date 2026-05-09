import React from 'react'

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-bd bg-s0 py-6 px-6">
            <div className="flex justify-between items-center text-xs text-t2">
                <div>
                    <p>AegisShare v4.2.1</p>
                    <p>© 2024 AegisShare Enterprise. All rights reserved.</p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-cy transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-cy transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-cy transition-colors">
                        Security
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
