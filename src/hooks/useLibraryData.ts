import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolId } from '@/contexts/SchoolContext';
import { toast } from 'sonner';
import type {
  LibrarySettings,
  LibraryRack,
  LibraryBookTitle,
  LibraryBookCopy,
  LibraryMember,
  LibraryCirculation,
  LibraryFine,
  LibraryPurchase,
  LibraryDonation,
  LibraryWithdrawal,
  LibraryStockVerification,
  LibraryDashboardStats,
  LibraryBookStatus,
  LibrarySourceType,
} from '@/types/library';

export function useLibraryData() {
  const { currentSchoolId } = useSchoolId();
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  
  // Core data
  const [racks, setRacks] = useState<LibraryRack[]>([]);
  const [bookTitles, setBookTitles] = useState<LibraryBookTitle[]>([]);
  const [bookCopies, setBookCopies] = useState<LibraryBookCopy[]>([]);
  const [members, setMembers] = useState<LibraryMember[]>([]);
  const [circulations, setCirculations] = useState<LibraryCirculation[]>([]);
  const [fines, setFines] = useState<LibraryFine[]>([]);
  
  // Registers
  const [purchases, setPurchases] = useState<LibraryPurchase[]>([]);
  const [donations, setDonations] = useState<LibraryDonation[]>([]);
  const [withdrawals, setWithdrawals] = useState<LibraryWithdrawal[]>([]);
  const [stockVerifications, setStockVerifications] = useState<LibraryStockVerification[]>([]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_settings')
      .select('*')
      .eq('school_id', currentSchoolId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching library settings:', error);
      return null;
    }
    
    setSettings(data);
    return data;
  }, [currentSchoolId]);

  // Initialize settings if not exists
  const initializeSettings = useCallback(async () => {
    if (!currentSchoolId) return;
    
    const existing = await fetchSettings();
    if (!existing) {
      const { data, error } = await supabase
        .from('library_settings')
        .insert({ school_id: currentSchoolId })
        .select()
        .single();
      
      if (error) {
        console.error('Error initializing settings:', error);
      } else {
        setSettings(data);
      }
    }
  }, [currentSchoolId, fetchSettings]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!currentSchoolId) return;
    
    setIsLoading(true);
    try {
      const [
        settingsRes,
        racksRes,
        titlesRes,
        copiesRes,
        membersRes,
        circulationsRes,
        finesRes,
        purchasesRes,
        donationsRes,
        withdrawalsRes,
        verificationsRes
      ] = await Promise.all([
        supabase.from('library_settings').select('*').eq('school_id', currentSchoolId).maybeSingle(),
        supabase.from('library_racks').select('*').eq('school_id', currentSchoolId).eq('is_active', true),
        supabase.from('library_book_titles').select('*').eq('school_id', currentSchoolId).order('title'),
        supabase.from('library_book_copies').select('*, book_title:library_book_titles(*), rack:library_racks(*)').eq('school_id', currentSchoolId),
        supabase.from('library_members').select('*').eq('school_id', currentSchoolId),
        supabase.from('library_circulation').select('*, book_copy:library_book_copies(*, book_title:library_book_titles(*)), member:library_members(*)').eq('school_id', currentSchoolId).order('issue_date', { ascending: false }),
        supabase.from('library_fines').select('*, member:library_members(*)').eq('school_id', currentSchoolId),
        supabase.from('library_purchases').select('*').eq('school_id', currentSchoolId).order('purchase_date', { ascending: false }),
        supabase.from('library_donations').select('*').eq('school_id', currentSchoolId).order('donation_date', { ascending: false }),
        supabase.from('library_withdrawals').select('*').eq('school_id', currentSchoolId).order('withdrawal_date', { ascending: false }),
        supabase.from('library_stock_verifications').select('*').eq('school_id', currentSchoolId).order('start_date', { ascending: false })
      ]);

      if (settingsRes.data) setSettings(settingsRes.data);
      if (racksRes.data) setRacks(racksRes.data);
      if (titlesRes.data) setBookTitles(titlesRes.data as LibraryBookTitle[]);
      if (copiesRes.data) setBookCopies(copiesRes.data as LibraryBookCopy[]);
      if (membersRes.data) setMembers(membersRes.data as LibraryMember[]);
      if (circulationsRes.data) setCirculations(circulationsRes.data as LibraryCirculation[]);
      if (finesRes.data) setFines(finesRes.data as LibraryFine[]);
      if (purchasesRes.data) setPurchases(purchasesRes.data as LibraryPurchase[]);
      if (donationsRes.data) setDonations(donationsRes.data as LibraryDonation[]);
      if (withdrawalsRes.data) setWithdrawals(withdrawalsRes.data as LibraryWithdrawal[]);
      if (verificationsRes.data) setStockVerifications(verificationsRes.data as LibraryStockVerification[]);
      
    } catch (error) {
      console.error('Error fetching library data:', error);
      toast.error('Failed to load library data');
    } finally {
      setIsLoading(false);
    }
  }, [currentSchoolId]);

  // Get next accession number
  const getNextAccessionNumber = useCallback(async (): Promise<number | null> => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase.rpc('get_next_accession_number', {
      p_school_id: currentSchoolId
    });
    
    if (error) {
      console.error('Error getting accession number:', error);
      return null;
    }
    
    return data;
  }, [currentSchoolId]);

  // CRUD Operations for Book Titles
  const createBookTitle = async (title: Partial<LibraryBookTitle>) => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_book_titles')
      .insert({ ...title, school_id: currentSchoolId })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add book title');
      return null;
    }
    
    setBookTitles(prev => [...prev, data as LibraryBookTitle]);
    toast.success('Book title added successfully');
    return data;
  };

  const updateBookTitle = async (id: string, updates: Partial<LibraryBookTitle>) => {
    const { data, error } = await supabase
      .from('library_book_titles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update book title');
      return null;
    }
    
    setBookTitles(prev => prev.map(t => t.id === id ? data as LibraryBookTitle : t));
    toast.success('Book title updated');
    return data;
  };

  // CRUD Operations for Book Copies
  const createBookCopy = async (copy: Partial<LibraryBookCopy>) => {
    if (!currentSchoolId) return null;
    
    const accessionNumber = await getNextAccessionNumber();
    if (!accessionNumber) {
      toast.error('Failed to generate accession number');
      return null;
    }
    
    const { data, error } = await supabase
      .from('library_book_copies')
      .insert({ 
        ...copy, 
        school_id: currentSchoolId,
        accession_number: accessionNumber,
        status: 'available' as LibraryBookStatus
      })
      .select('*, book_title:library_book_titles(*), rack:library_racks(*)')
      .single();
    
    if (error) {
      toast.error('Failed to add book copy');
      console.error(error);
      return null;
    }
    
    setBookCopies(prev => [...prev, data as LibraryBookCopy]);
    toast.success(`Book copy added with Accession #${accessionNumber}`);
    return data;
  };

  const updateBookCopy = async (id: string, updates: Partial<LibraryBookCopy>) => {
    const { data, error } = await supabase
      .from('library_book_copies')
      .update(updates)
      .eq('id', id)
      .select('*, book_title:library_book_titles(*), rack:library_racks(*)')
      .single();
    
    if (error) {
      toast.error('Failed to update book copy');
      return null;
    }
    
    setBookCopies(prev => prev.map(c => c.id === id ? data as LibraryBookCopy : c));
    toast.success('Book copy updated');
    return data;
  };

  // CRUD Operations for Members
  const createMember = async (member: Partial<LibraryMember>) => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_members')
      .insert({ ...member, school_id: currentSchoolId })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add member');
      return null;
    }
    
    setMembers(prev => [...prev, data as LibraryMember]);
    toast.success('Member added successfully');
    return data;
  };

  const updateMember = async (id: string, updates: Partial<LibraryMember>) => {
    const { data, error } = await supabase
      .from('library_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update member');
      return null;
    }
    
    setMembers(prev => prev.map(m => m.id === id ? data as LibraryMember : m));
    toast.success('Member updated');
    return data;
  };

  // Circulation Operations
  const issueBook = async (copyId: string, memberId: string, dueDate: string) => {
    if (!currentSchoolId) return null;
    
    // Check if copy is available
    const copy = bookCopies.find(c => c.id === copyId);
    if (!copy || copy.status !== 'available') {
      toast.error('Book is not available for issue');
      return null;
    }
    
    // Check if it's a reference book
    if (copy.is_reference) {
      toast.error('Reference books cannot be issued');
      return null;
    }
    
    // Check member's borrowing limit
    const member = members.find(m => m.id === memberId);
    if (!member) {
      toast.error('Member not found');
      return null;
    }
    
    const maxBooks = member.member_type === 'student' 
      ? (settings?.student_max_books || 2)
      : (settings?.staff_max_books || 5);
    
    if (member.current_borrowed >= maxBooks) {
      toast.error(`Member has reached borrowing limit of ${maxBooks} books`);
      return null;
    }
    
    // Create circulation record
    const { data: circulation, error: circError } = await supabase
      .from('library_circulation')
      .insert({
        school_id: currentSchoolId,
        copy_id: copyId,
        member_id: memberId,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: dueDate,
        status: 'issued'
      })
      .select('*, book_copy:library_book_copies(*, book_title:library_book_titles(*)), member:library_members(*)')
      .single();
    
    if (circError) {
      toast.error('Failed to issue book');
      console.error(circError);
      return null;
    }
    
    // Update copy status
    await supabase
      .from('library_book_copies')
      .update({ status: 'issued' as LibraryBookStatus })
      .eq('id', copyId);
    
    // Refresh data
    await fetchAllData();
    
    toast.success('Book issued successfully');
    return circulation;
  };

  const returnBook = async (circulationId: string, condition?: string, remarks?: string) => {
    const circulation = circulations.find(c => c.id === circulationId);
    if (!circulation) {
      toast.error('Circulation record not found');
      return null;
    }
    
    const today = new Date();
    const dueDate = new Date(circulation.due_date);
    const overdueDays = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate fine if overdue
    const member = members.find(m => m.id === circulation.member_id);
    const finePerDay = member?.member_type === 'student'
      ? (settings?.student_fine_per_day || 1)
      : (settings?.staff_fine_per_day || 0);
    
    const fineAmount = overdueDays * finePerDay;
    
    // Update circulation record
    const { data, error } = await supabase
      .from('library_circulation')
      .update({
        return_date: today.toISOString().split('T')[0],
        return_condition: condition,
        is_overdue: overdueDays > 0,
        overdue_days: overdueDays,
        fine_amount: fineAmount,
        status: 'returned',
        remarks
      })
      .eq('id', circulationId)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to return book');
      return null;
    }
    
    // Update copy status back to available
    await supabase
      .from('library_book_copies')
      .update({ 
        status: 'available' as LibraryBookStatus,
        condition: condition || 'Good'
      })
      .eq('id', circulation.copy_id);
    
    // Create fine record if applicable
    if (fineAmount > 0 && currentSchoolId) {
      await supabase
        .from('library_fines')
        .insert({
          school_id: currentSchoolId,
          member_id: circulation.member_id,
          circulation_id: circulationId,
          copy_id: circulation.copy_id,
          fine_type: 'overdue',
          fine_amount: fineAmount,
          balance: fineAmount,
          fine_date: today.toISOString().split('T')[0]
        });
    }
    
    await fetchAllData();
    
    toast.success(`Book returned successfully${fineAmount > 0 ? `. Fine: ₹${fineAmount}` : ''}`);
    return data;
  };

  const renewBook = async (circulationId: string) => {
    const circulation = circulations.find(c => c.id === circulationId);
    if (!circulation) {
      toast.error('Circulation record not found');
      return null;
    }
    
    const member = members.find(m => m.id === circulation.member_id);
    const maxRenewals = member?.member_type === 'student'
      ? (settings?.student_max_renewals || 1)
      : (settings?.staff_max_renewals || 2);
    
    if (circulation.renewal_count >= maxRenewals) {
      toast.error(`Maximum renewals (${maxRenewals}) reached`);
      return null;
    }
    
    const loanDays = member?.member_type === 'student'
      ? (settings?.student_loan_days || 14)
      : (settings?.staff_loan_days || 30);
    
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + loanDays);
    
    const { data, error } = await supabase
      .from('library_circulation')
      .update({
        due_date: newDueDate.toISOString().split('T')[0],
        renewal_count: circulation.renewal_count + 1,
        last_renewed_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', circulationId)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to renew book');
      return null;
    }
    
    await fetchAllData();
    toast.success('Book renewed successfully');
    return data;
  };

  // Rack Operations
  const createRack = async (rack: Partial<LibraryRack>) => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_racks')
      .insert({ ...rack, school_id: currentSchoolId })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add rack');
      return null;
    }
    
    setRacks(prev => [...prev, data as LibraryRack]);
    toast.success('Rack added successfully');
    return data;
  };

  // Purchase Operations
  const createPurchase = async (purchase: Partial<LibraryPurchase>) => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_purchases')
      .insert({ ...purchase, school_id: currentSchoolId })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add purchase');
      return null;
    }
    
    setPurchases(prev => [data as LibraryPurchase, ...prev]);
    toast.success('Purchase recorded successfully');
    return data;
  };

  // Donation Operations
  const createDonation = async (donation: Partial<LibraryDonation>) => {
    if (!currentSchoolId) return null;
    
    const { data, error } = await supabase
      .from('library_donations')
      .insert({ ...donation, school_id: currentSchoolId })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add donation');
      return null;
    }
    
    setDonations(prev => [data as LibraryDonation, ...prev]);
    toast.success('Donation recorded successfully');
    return data;
  };

  // Get dashboard stats
  const getDashboardStats = useCallback((): LibraryDashboardStats => {
    const totalBooks = bookCopies.filter(c => c.status !== 'withdrawn').length;
    const availableBooks = bookCopies.filter(c => c.status === 'available').length;
    const issuedBooks = bookCopies.filter(c => c.status === 'issued').length;
    const overdueCirculations = circulations.filter(c => c.status === 'issued' && new Date(c.due_date) < new Date());
    const activeMembers = members.filter(m => m.is_active && !m.is_blocked).length;
    const pendingFines = fines.filter(f => f.status === 'pending');
    const totalFinesAmount = pendingFines.reduce((sum, f) => sum + f.balance, 0);
    
    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks: overdueCirculations.length,
      totalMembers: members.length,
      activeMembers,
      pendingFines: pendingFines.length,
      totalFinesAmount,
      recentCirculations: circulations.slice(0, 10),
      popularBooks: []
    };
  }, [bookCopies, circulations, members, fines]);

  // Initialize on mount
  useEffect(() => {
    if (currentSchoolId) {
      initializeSettings();
      fetchAllData();
    }
  }, [currentSchoolId, initializeSettings, fetchAllData]);

  return {
    isLoading,
    settings,
    racks,
    bookTitles,
    bookCopies,
    members,
    circulations,
    fines,
    purchases,
    donations,
    withdrawals,
    stockVerifications,
    
    // Actions
    fetchAllData,
    fetchSettings,
    getNextAccessionNumber,
    getDashboardStats,
    
    // CRUD
    createBookTitle,
    updateBookTitle,
    createBookCopy,
    updateBookCopy,
    createMember,
    updateMember,
    createRack,
    createPurchase,
    createDonation,
    
    // Circulation
    issueBook,
    returnBook,
    renewBook,
  };
}
