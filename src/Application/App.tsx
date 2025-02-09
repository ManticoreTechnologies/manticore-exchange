import CreateListingPage from './pages/Trade/CreateListingPage/CreateListingPage';

// In your router configuration:
<Routes>
    {/* ... other routes ... */}
    <Route path="/trade" element={<Trading />} />
    <Route path="/trade/create" element={<CreateListingPage />} />
    {/* ... other routes ... */}
</Routes> 