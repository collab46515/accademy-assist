-- Add RLS policies for all library tables using existing has_library_access function

-- library_settings policies
CREATE POLICY "Users can view library settings for their school"
  ON public.library_settings FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert library settings for their school"
  ON public.library_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update library settings for their school"
  ON public.library_settings FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_racks policies
CREATE POLICY "Users can view racks for their school"
  ON public.library_racks FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert racks for their school"
  ON public.library_racks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update racks for their school"
  ON public.library_racks FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can delete racks for their school"
  ON public.library_racks FOR DELETE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_book_titles policies
CREATE POLICY "Users can view book titles for their school"
  ON public.library_book_titles FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert book titles for their school"
  ON public.library_book_titles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update book titles for their school"
  ON public.library_book_titles FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_book_copies policies
CREATE POLICY "Users can view book copies for their school"
  ON public.library_book_copies FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert book copies for their school"
  ON public.library_book_copies FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update book copies for their school"
  ON public.library_book_copies FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_members policies
CREATE POLICY "Users can view library members for their school"
  ON public.library_members FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert library members for their school"
  ON public.library_members FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update library members for their school"
  ON public.library_members FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_circulation policies
CREATE POLICY "Users can view circulation for their school"
  ON public.library_circulation FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert circulation for their school"
  ON public.library_circulation FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update circulation for their school"
  ON public.library_circulation FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_reservations policies
CREATE POLICY "Users can view reservations for their school"
  ON public.library_reservations FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert reservations for their school"
  ON public.library_reservations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update reservations for their school"
  ON public.library_reservations FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_fines policies
CREATE POLICY "Users can view fines for their school"
  ON public.library_fines FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert fines for their school"
  ON public.library_fines FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update fines for their school"
  ON public.library_fines FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_purchases policies
CREATE POLICY "Users can view purchases for their school"
  ON public.library_purchases FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert purchases for their school"
  ON public.library_purchases FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update purchases for their school"
  ON public.library_purchases FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_donations policies
CREATE POLICY "Users can view donations for their school"
  ON public.library_donations FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert donations for their school"
  ON public.library_donations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update donations for their school"
  ON public.library_donations FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_withdrawals policies
CREATE POLICY "Users can view withdrawals for their school"
  ON public.library_withdrawals FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert withdrawals for their school"
  ON public.library_withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update withdrawals for their school"
  ON public.library_withdrawals FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_stock_verifications policies
CREATE POLICY "Users can view stock verifications for their school"
  ON public.library_stock_verifications FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert stock verifications for their school"
  ON public.library_stock_verifications FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update stock verifications for their school"
  ON public.library_stock_verifications FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));

-- library_stock_verification_items policies
CREATE POLICY "Users can view stock verification items"
  ON public.library_stock_verification_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.library_stock_verifications sv
    WHERE sv.id = verification_id
    AND public.has_library_access(sv.school_id)
  ));

CREATE POLICY "Users can insert stock verification items"
  ON public.library_stock_verification_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.library_stock_verifications sv
    WHERE sv.id = verification_id
    AND public.has_library_access(sv.school_id)
  ));

CREATE POLICY "Users can update stock verification items"
  ON public.library_stock_verification_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.library_stock_verifications sv
    WHERE sv.id = verification_id
    AND public.has_library_access(sv.school_id)
  ));

-- library_audit_log policies (read-only for users)
CREATE POLICY "Users can view audit logs for their school"
  ON public.library_audit_log FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "System can insert audit logs"
  ON public.library_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

-- library_accession_sequence policies
CREATE POLICY "Users can view accession sequence for their school"
  ON public.library_accession_sequence FOR SELECT
  TO authenticated
  USING (public.has_library_access(school_id));

CREATE POLICY "Users can insert accession sequence for their school"
  ON public.library_accession_sequence FOR INSERT
  TO authenticated
  WITH CHECK (public.has_library_access(school_id));

CREATE POLICY "Users can update accession sequence for their school"
  ON public.library_accession_sequence FOR UPDATE
  TO authenticated
  USING (public.has_library_access(school_id));